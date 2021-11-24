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

  db.query(`SELECT * FROM reviews WHERE (product_id = $1) ORDER BY ${sortAlgo} LIMIT $2`, [product_id, count])
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
    SELECT * FROM meta
    WHERE meta.product_id = $1`, [product_id])
    .then(({ rows }) => {
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
        characteristics: {},
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
    product_id, rating, summary, body, recommend, name, email, photos,
  } = req.body;

  db.query(`
    INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING review_id
    `, [product_id, rating, Date.now(), summary, body, recommend, name, email])
    .then(({ rows }) => {
      const { review_id } = rows[0];
      if (photos.length > 0) {
        let valueQuery = '';
        for (let i = 0; i < photos.length; i += 1) {
          valueQuery += `($${i + 2}, $1), `;
        }
        valueQuery = valueQuery.slice(0, -2);

        db.query(`INSERT INTO photos(url, review_id) VALUES ${valueQuery}`, [review_id, ...photos])
          .then(() => {
            res.status(201).send(rows[0]);
          }).catch((err) => {
            res.status(400).send(err.message);
          });
      } else {
        res.status(201).send(rows[0]);
      }
    }).catch((err) => {
      res.status(400).send(err.message);
    });
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
