-- Table visualizer file
-- psql -d loungeo -f schemas/test.sql

\echo PHOTOS;
SELECT * FROM photos ORDER BY photos_id ASC LIMIT 20;
\echo REVIEWS;
SELECT * FROM reviews ORDER BY review_id ASC LIMIT 20;
\echo META;
SELECT * FROM meta ORDER BY product_id ASC LIMIT 20;
\echo CHARACTERISTICS;
SELECT * FROM characteristics ORDER BY characteristics_id ASC LIMIT 20;
\echo CHARACTERISTICS_PRODUCTS_JOIN;
SELECT * FROM characteristic_votes ORDER BY characteristic_vote_id ASC LIMIT 20;
\echo CHAR_NAME_VOTE_JOIN;
SELECT * FROM char_name_vote_join ORDER BY char_join_id ASC LIMIT 20;
\echo TEMP_CHARACTERISTIC_REVIEWS;