/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { product_id } = req.query;

  db.query(`
    SELECT * FROM meta, char_name_vote_join, characteristics
    WHERE meta.product_id = $1
    AND char_name_vote_join.product_id = $1
    AND char_name_vote_join.characteristic_id=characteristics.characteristics_id
    `, [product_id])
    .then(({ rows }) => {
      if (rows.length > 0) {
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
      } else {
        res.status(200).send({
          product_id,
          ratings: {},
          recommended: {},
          characteristics: {},
        });
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
