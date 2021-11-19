/* psql -d loungeo -f schemas/test.sql */

\echo PHOTOS;
SELECT * FROM photos LIMIT 5;
\echo REVIEWS;
SELECT * FROM reviews LIMIT 5;
\echo META;
SELECT * FROM meta LIMIT 5;
\echo CHARACTERISTICS;
SELECT * FROM characteristics LIMIT 5;
\echo CHARACTERISTICS_PRODUCTS_JOIN;
SELECT * FROM characteristics_products_join LIMIT 5;
\echo CHARACTERISTIC_VOTES;
SELECT * FROM characteristic_votes LIMIT 5;
\echo TEMP_CHARACTERISTICS;
SELECT * FROM temp_characteristics LIMIT 5;
\echo TEMP_CHARACTERISTIC_REVIEWS;
SELECT * FROM temp_characteristic_reviews LIMIT 5;