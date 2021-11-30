const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

module.exports = {
  async query(text, params) {
    const res = await pool.query(text, params);
    return res;
  },
  async getClient() {
    const client = await pool.connect();
    const { query } = client;
    const { release } = client;
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  },
};
