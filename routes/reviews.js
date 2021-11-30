/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const {
    page = 1,
    count = 5,
    sort = 'relevant',
    product_id,
  } = req.query;

  if (!product_id) {
    res.status(422).send('Error: invalid product_id provided');
  } else if (page < 1 || count < 0) {
    res.status(422).send('Error: invalid search parameters provided');
  }

  let sortAlgo;

  switch (sort) {
    case 'newest':
      sortAlgo = 'date DESC';
      break;
    case 'helpful':
      sortAlgo = 'helpfulness DESC';
      break;
    default:
      sortAlgo = 'helpfulness DESC, date DESC';
      break;
  }

  db.query(`
  SELECT * FROM photos
  RIGHT OUTER JOIN (SELECT * FROM reviews
  WHERE (product_id = $1)
  AND (reported = false)
  ORDER BY ${sortAlgo}
  LIMIT $2) AS review
  ON photos.review_id = review.review_id
  `, [parseInt(product_id, 10), parseInt(count, 10)])
    .then((result) => {
      const order = [];
      const results = {};
      result.rows.forEach((row) => {
        const date = new Date(parseInt(row.date, 10));
        if (!results[row.review_id]) {
          results[row.review_id] = {
            review_id: row.review_id,
            rating: row.rating,
            summary: row.summary,
            recommend: row.recommend,
            response: row.response,
            body: row.body,
            date: date.toISOString(),
            reviewer_name: row.reviewer_name,
            helpfulness: row.helpfulness,
            photos: row.photos_id ? [{ id: row.photos_id, url: row.url }] : [],
          };
          order.push(row.review_id);
        } else {
          results[row.review_id].photos.push({ id: row.photos_id, url: row.url });
        }
      });
      res.status(200).send({
        product: product_id,
        page,
        count,
        results: order.map((key) => results[key]),
      });
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

router.post('/', (req, res) => {
  const {
    product_id, rating, summary, body, recommend, name, email, photos, characteristics,
  } = req.body;

  (async () => {
    try {
      await db.query('BEGIN');

      db.query(`
        INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING review_id
        `, [product_id, rating, Date.now(), summary, body, recommend, name, email])
        .then(async ({ rows }) => {
          const { review_id } = rows[0];
          const rec = recommend ? 'recommended_true_vote' : 'recommended_false_vote';
          const score = `rating_${rating}`;
          try {
            if (photos.length > 0) {
              let valueQuery = '';
              for (let i = 0; i < photos.length; i += 1) {
                valueQuery += `($${i + 2}, $1), `;
              }
              valueQuery = valueQuery.slice(0, -2);
              await db.query(`INSERT INTO photos(url, review_id) VALUES ${valueQuery}`, [review_id, ...photos]);
            }
            await db.query(`UPDATE meta SET ${rec} = ${rec} + 1, ${score} = ${score} + 1 WHERE product_id = $1`, [product_id]);

            const charIds = Object.keys(characteristics);
            const charQueries = [];
            for (let i = 0; i < charIds.length; i += 1) {
              charQueries.push(db.query('UPDATE char_name_vote_join SET total_score = total_score + $1, total_votes = total_votes + 1 WHERE char_join_id = $2', [characteristics[charIds[i]], parseInt(charIds[i], 10)]));
            }
            await Promise.all(charQueries);
            await db.query('COMMIT');
            res.status(201).send({ review_id });
          } catch (err) {
            db.query('ROLLBACK');
            res.status(400).send(err.message);
          }
        });
    } catch (e) {
      db.query('ROLLBACK');
      res.status(400).send(e.message);
    }
  })().catch((e) => res.status(400).send(e.message));
});

router.put('/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  db.query(`
    UPDATE reviews SET helpfulness = (helpfulness + 1) WHERE review_id = $1`, [review_id])
    .then(() => {
      res.status(204).send();
    }).catch((err) => res.status(400).send(err));
});

router.put('/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  db.query(`
    UPDATE reviews SET reported = true WHERE review_id = $1`, [review_id])
    .then(() => {
      res.status(204).send();
    }).catch((err) => res.status(400).send(err));
});

module.exports = router;
