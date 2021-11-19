-- psql -d loungeo -f schemas/data_modifier.sql

DROP TABLE IF EXISTS characteristic_votes CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS meta CASCADE;

CREATE TABLE meta (
  product_id integer PRIMARY KEY,
  recommended_true_vote integer NOT NULL DEFAULT 0,
  recommended_false_vote integer NOT NULL DEFAULT 0,
  rating_1 integer NOT NULL DEFAULT 0,
  rating_2 integer NOT NULL DEFAULT 0,
  rating_3 integer NOT NULL DEFAULT 0,
  rating_4 integer NOT NULL DEFAULT 0,
  rating_5 integer NOT NULL DEFAULT 0
) WITH (
  OIDS=FALSE
);


CREATE TABLE characteristics (
  characteristics_id serial PRIMARY KEY,
  characteristic_name varchar(32) NOT NULL
) WITH (
  OIDS=FALSE
);


CREATE TABLE characteristic_votes (
  characteristic_vote_id serial PRIMARY KEY,
  total_score integer NOT NULL DEFAULT 0,
  total_votes integer NOT NULL DEFAULT 0
) WITH (
  OIDS=FALSE
);

/* ---------- CHARACTERISTIC TABLE CONSTRUCTION ---------- */

INSERT INTO characteristics(characteristic_name) SELECT DISTINCT characteristic_name FROM char_name_vote_join;

ALTER TABLE char_name_vote_join ADD COLUMN characteristic_id smallint;

UPDATE char_name_vote_join SET characteristic_id=characteristics_id
FROM characteristics
WHERE char_name_vote_join.characteristic_name=characteristics.characteristic_name;

INSERT INTO characteristic_votes(characteristic_vote_id, total_score, total_votes)
(SELECT characteristic_id, SUM(value), COUNT(value)
FROM temp_characteristic_reviews
GROUP BY characteristic_id);

ALTER TABLE char_name_vote_join DROP COLUMN characteristic_name;

DROP TABLE temp_characteristic_reviews;


/* ---------- META TABLE CONSTRUCTION ---------- */

INSERT INTO meta(product_id) SELECT DISTINCT product_id FROM reviews;

/* count of each rating per product */


UPDATE meta SET rating_1=count
FROM (SELECT product_id, COUNT(rating)
FROM reviews
WHERE rating=1
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

UPDATE meta SET rating_2=count
FROM (SELECT product_id, COUNT(rating)
FROM reviews
WHERE rating=2
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

UPDATE meta SET rating_3=count
FROM (SELECT product_id, COUNT(rating)
FROM reviews
WHERE rating=3
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

UPDATE meta SET rating_4=count
FROM (SELECT product_id, COUNT(rating)
FROM reviews
WHERE rating=4
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

UPDATE meta SET rating_5=count
FROM (SELECT product_id, COUNT(rating)
FROM reviews
WHERE rating=5
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

/* count of recommended votes per product */

UPDATE meta SET recommended_true_vote=count
FROM (SELECT product_id, COUNT(recommend)
FROM reviews
WHERE recommend=true
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;

UPDATE meta SET recommended_false_vote=count
FROM (SELECT product_id, COUNT(recommend)
FROM reviews
WHERE recommend=false
GROUP BY product_id) AS c
WHERE meta.product_id=c.product_id;
