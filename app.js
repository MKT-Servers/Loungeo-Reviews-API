/* eslint-disable camelcase */
const express = require('express');

const app = express();
app.use(express.json());

app.use('/reviews', require('./routes/reviews'));
app.use('/reviews/meta', require('./routes/meta'));

module.exports = app;
