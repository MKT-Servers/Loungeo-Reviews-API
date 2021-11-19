/* psql -d loungeo -f schemas/test.sql */

\echo PHOTOS;
SELECT * FROM photos LIMIT 5;
\echo REVIEWS;
SELECT * FROM reviews LIMIT 5;
\echo META;
SELECT * FROM meta LIMIT 5;
\echo CHARACTERISTICS;
SELECT * FROM characteristics LIMIT 5;
\echo characteristics_products_join;
SELECT * FROM characteristics_products_join LIMIT 5;
\echo characteristic_votes;
SELECT * FROM characteristic_votes LIMIT 5;
\echo temp_characteristics;
SELECT * FROM temp_characteristics LIMIT 5;
\echo temp_characteristic_reviews;
SELECT * FROM temp_characteristic_reviews LIMIT 5;