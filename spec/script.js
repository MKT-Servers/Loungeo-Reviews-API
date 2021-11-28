import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<50'], // 95% of requests should be below 200ms
  },
};

export default function script() {
  const payload = JSON.stringify({
    product_id: '61635',
    rating: 5,
    summary: 'test',
    body: 'test',
    recommend: true,
    name: 'testy',
    email: 'test@test.com',
    photos: ['test photo url', 'test photo url', 'test photo url', 'test photo url', 'test photo url'],
    characteristics: {
      205910: 5, 205908: 5, 205911: 5, 205909: 5,
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.get('http://localhost:3000/reviews?product_id=61635&count=50&sort=newest');
  sleep(1);

  http.get('http://localhost:3000/reviews?product_id=61635&count=50&sort=relevancy');
  sleep(1);

  http.get('http://localhost:3000/reviews?product_id=61635&count=50&sort=helpful');
  sleep(1);

  http.get('http://localhost:3000/reviews/meta?product_id=61635');
  sleep(1);

  http.put('http://localhost:3000/reviews/355406/helpful');
  sleep(1);

  http.post('http://localhost:3000/reviews/', payload, params);
  sleep(1);
}
