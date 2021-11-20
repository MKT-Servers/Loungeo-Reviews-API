const request = require('supertest');
const app = require('../app');

jest.setTimeout(10000);

describe('API', () => {
  const productId = '?product_id=';
  const sort = '?sort=';
  const page = '?page=';
  const count = '?count=';

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
  });
});
