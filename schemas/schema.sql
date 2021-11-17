DROP DATABASE IF EXISTS loungeo;
CREATE DATABASE loungeo;
\c loungeo;

DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS recommended CASCADE;
DROP TABLE IF EXISTS characteristic_votes CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product CASCADE;



CREATE TABLE photos (
	photos_id serial PRIMARY KEY,
	url varchar(255) DEFAULT null,
	review_id integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE reviews (
	review_id serial PRIMARY KEY,
	product_id integer NOT NULL,
	rating smallint NOT NULL CHECK (rating > 0 AND rating < 6),
	date bigint NOT NULL,
	summary varchar(255) NOT NULL,
	body varchar(1000) NOT NULL,
	recommend BOOLEAN NOT NULL DEFAULT false,
	reported BOOLEAN NOT NULL DEFAULT false,
	reviewer_name varchar(50) NOT NULL,
	reviewer_email varchar(50) NOT NULL,
	response varchar(255) DEFAULT null,
	helpfulness integer NOT NULL DEFAULT 0
) WITH (
  OIDS=FALSE
);



CREATE TABLE product (
	product_id integer PRIMARY KEY,
	recommended_id integer NOT NULL,
	ratings_id integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE characteristics (
	characteristics_id serial PRIMARY KEY,
	characteristic_name varchar(32) NOT NULL,
	product_id integer NOT NULL,
	characteristic_vote_id integer NOT NULL
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



CREATE TABLE recommended (
	recommended_id serial PRIMARY KEY,
	true_vote integer NOT NULL DEFAULT 0,
	false_vote integer NOT NULL DEFAULT 0
) WITH (
  OIDS=FALSE
);



CREATE TABLE ratings (
	ratings_id serial PRIMARY KEY,
	rating_1 integer NOT NULL DEFAULT 0,
	rating_2 integer NOT NULL DEFAULT 0,
	rating_3 integer NOT NULL DEFAULT 0,
	rating_4 integer NOT NULL DEFAULT 0,
	rating_5 integer NOT NULL DEFAULT 0
) WITH (
  OIDS=FALSE
);



ALTER TABLE photos ADD FOREIGN KEY (review_id) REFERENCES reviews(review_id);
ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES product(product_id);
ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES product(product_id);
ALTER TABLE characteristics ADD FOREIGN KEY (characteristic_vote_id) REFERENCES characteristic_votes(characteristic_vote_id);
ALTER TABLE product ADD FOREIGN KEY (recommended_id) REFERENCES recommended(recommended_id);
ALTER TABLE product ADD FOREIGN KEY (ratings_id) REFERENCES ratings(ratings_id);