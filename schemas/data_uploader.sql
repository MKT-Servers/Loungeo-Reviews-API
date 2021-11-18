/* psql -d loungeo -f schemas/data_uploader.sql */

\c loungeo;

\COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './data/reviews.csv' WITH DELIMITER ',' CSV HEADER;

\COPY photos(photos_id, review_id, url) FROM './data/reviews_photos.csv' WITH DELIMITER ',' CSV HEADER;

\COPY temp_characteristics(characteristics_id, product_id, characteristic_name) FROM './data/characteristics.csv' WITH DELIMITER ',' CSV HEADER;

\COPY temp_characteristic_reviews FROM './data/characteristic_reviews.csv' WITH DELIMITER ',' CSV HEADER;
