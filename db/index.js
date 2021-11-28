const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 50) {
      console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  },
  async getClient() {
    const client = await pool.connect();
    const { query } = client;
    const { release } = client;
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  },
};
