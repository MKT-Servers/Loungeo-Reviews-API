/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/reviews', (req, res) => {
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

  db.query(`SELECT * FROM reviews WHERE (product_id = $1) AND (reported=false) ORDER BY ${sortAlgo} LIMIT $2`, [product_id, count])
    .then((result) => {
      res.status(200).send({
        product: product_id,
        page,
        count,
        results: result.rows,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Meta info

app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;

  db.query(`
    SELECT * FROM meta, char_name_vote_join, characteristics
    WHERE meta.product_id = $1
    AND char_name_vote_join.product_id = $1
    AND char_name_vote_join.characteristic_id=characteristics.characteristics_id
    `, [product_id])
    .then(({ rows }) => {
      const char_data = {};
      for (let i = 0; i < rows.length; i += 1) {
        char_data[rows[i].characteristic_name] = {
          id: rows[i].char_join_id,
          value: (rows[i].total_score / (rows[i].total_votes * 5)) * 5,
        };
      }
      const response = {
        product_id,
        ratings: {
          1: rows[0].rating_1,
          2: rows[0].rating_2,
          3: rows[0].rating_3,
          4: rows[0].rating_4,
          5: rows[0].rating_5,
        },
        recommended: {
          true: rows[0].recommended_true_vote,
          false: rows[0].recommended_false_vote,
        },
        characteristics: char_data,
      };
      res.status(200).send(response);
    }).catch((err) => {
      res.status(500).send(err);
    });
});

// Reviews

app.post('/reviews', (req, res) => {
  // TODO - deal with characteristics
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

// Helpful

app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  db.query(`
    UPDATE reviews SET helpfulness = (helpfulness + 1) WHERE review_id = $1`, [review_id])
    .then((result) => {
      res.status(204).send(result);
    }).catch((err) => res.status(400).send(err));
});

// Report

app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  db.query(`
    UPDATE reviews SET reported = true WHERE review_id = $1`, [review_id])
    .then((result) => {
      res.status(204).send(result);
    }).catch((err) => res.status(400).send(err));
});

module.exports = app;
