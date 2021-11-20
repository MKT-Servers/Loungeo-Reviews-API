/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

// params and query
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

app.get('/reviews/meta', (req, res) => {
  // TODO
});

app.post('/reviews', (req, res) => {
  // TODO

});

app.put('/reviews/:review_id/helpful', (req, res) => {
  // TODO

});

app.put('/reviews/:review_id/report', (req, res) => {
  // TODO

});

app.listen(port, () => {
  console.log(`Listening at port ${port}...`);
});
