const request = require('supertest');
const app = require('../app');

jest.setTimeout(10000);

describe('API', () => {
  const productId = '?product_id=';
  const sort = '&sort=';
  const count = '&count=';

  describe('get /reviews/', () => {
    it('should return a 200 when given a valid product id', async () => {
      const response = await request(app).get(`/reviews${productId}1`);
      expect(response.statusCode).toBe(200);
    });

    it('should return the proper object', async () => {
      const response = await request(app).get(`/reviews${productId}1`);
      expect(response.body.product).toBe('1');
    });

    it('should send page 1 if no pages specified', async () => {
      const response = await request(app).get(`/reviews${productId}1`);
      expect(response.body.page).toBe(1);
    });

    it('should send 5 reviews if no review count specified', async () => {
      const response = await request(app).get(`/reviews${productId}1`);
      expect(response.body.count).toBe(5);
    });

    it('should return reviews', async () => {
      const response = await request(app).get(`/reviews${productId}1`);
      expect(response.body.results.length).not.toBe(0);
    });

    it('should return 10 reviews when the count query is used', async () => {
      const response = await request(app).get(`/reviews${productId}61618${count}10`);
      expect(response.body.results.length).toBe(10);
    });

    it('should sort by helpfulness', async () => {
      const response = await request(app).get(`/reviews${productId}61618${sort}helpful`);
      const helpfulness = [];
      for (let i = 0; i < response.body.results.length; i += 1) {
        helpfulness.push(response.body.results[i].helpfulness);
      }
      const answer = [...helpfulness].sort((a, b) => b - a);
      expect(helpfulness).toEqual(answer);
    });

    it('should sort by newest', async () => {
      const response = await request(app).get(`/reviews${productId}61618${sort}newest`);
      const date = [];
      for (let i = 0; i < response.body.results.length; i += 1) {
        date.push(response.body.results[i].data);
      }
      const answer = [...date].sort((a, b) => b - a);
      expect(date).toEqual(answer);
    });
  });
});
