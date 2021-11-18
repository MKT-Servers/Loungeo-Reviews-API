/* psql -d loungeo -f schemas/data_uploader.sql */

\c loungeo;

\COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM './data/reviews.csv' WITH DELIMITER ',' CSV HEADER;
