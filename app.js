/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');

const app = express();

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
      sortAlgo = 'date';
      break;
    case 'helpful':
      sortAlgo = 'helpfulness';
      break;
    default:
      // revisit relevant algorithm
      sortAlgo = 'helpfulness';
      break;
  }

  // NEEDS WORK

  db.query('SELECT * FROM reviews WHERE product_id = $1 ORDER BY $2 DESC LIMIT $3', [product_id, sortAlgo, count * page])
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
  // TODO - deal with photos and characteristics
  const {
    product_id, rating, summary, body, recommend, name, email,
  } = req.body;

  db.query(`
    INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [product_id, rating, Date.now(), summary, body, recommend, name, email])
    .then((result) => {
      res.status(201).send(result);
    }).catch(() => {
      res.status(400).send('Invalid data type');
    });
  db.query(`
    INSERT INTO photos(url, review_id)
    VALUES ()`)
    .then()
    .catch();
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
