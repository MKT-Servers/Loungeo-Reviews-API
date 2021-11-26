import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<50'], // 95% of requests should be below 200ms
  },
};

export default function () {
  http.get('http://localhost:3000/reviews/meta?product_id=61635&count=50');
  sleep(1);
}
