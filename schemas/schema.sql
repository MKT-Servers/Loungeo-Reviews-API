CREATE SCHEMA loungeo_reviews;

CREATE TABLE "loungeo_reviews.photos" (
	"id" serial PRIMARY KEY,
	"url" varchar(255) DEFAULT 'null',
	"review_id" integer NOT NULL,
	CONSTRAINT "photos_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.reviews" (
	"review_id" serial PRIMARY KEY,
	"product_id" integer NOT NULL,
	"rating" smallint NOT NULL CHECK valid_rating (rating > 0 AND rating < 6),
	"date" bigint NOT NULL,
	"summary" varchar(60) NOT NULL,
	"body" varchar(1000) NOT NULL,
	"recommend" BOOLEAN NOT NULL DEFAULT 'false',
	"reported" BOOLEAN NOT NULL DEFAULT 'false',
	"reviewer_name" varchar(50) NOT NULL,
	"reviewer_email" varchar(50) NOT NULL,
	"response" varchar(255) DEFAULT 'null',
	"helpfulness" integer NOT NULL DEFAULT '0',
	CONSTRAINT "reviews_pk" PRIMARY KEY ("review_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.product" (
	"product_id" integer PRIMARY KEY,
	"recommend_id" integer NOT NULL,
	"ratings_id" integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.characteristics" (
	"characteristic_id" serial PRIMARY KEY,
	"characteristic_name" varchar(32) NOT NULL,
	"product_id" integer NOT NULL,
	"characteristic_vote_id" integer NOT NULL,
	CONSTRAINT "characteristics_pk" PRIMARY KEY ("characteristic_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.characteristic_votes" (
	"characteristic_id" serial PRIMARY KEY,
	"total_score" integer NOT NULL DEFAULT '0',
	"total_votes" integer NOT NULL DEFAULT '0',
	CONSTRAINT "characteristic_votes_pk" PRIMARY KEY ("characteristic_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.recommended" (
	"recommended_id" serial PRIMARY KEY,
	"true_vote" integer NOT NULL DEFAULT '0',
	"false_vote" integer NOT NULL DEFAULT '0',
	CONSTRAINT "recommended_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "loungeo_reviews.ratings" (
	"ratings_id" serial PRIMARY KEY,
	"1" integer NOT NULL DEFAULT '0',
	"2" integer NOT NULL DEFAULT '0',
	"3" integer NOT NULL DEFAULT '0',
	"4" integer NOT NULL DEFAULT '0',
	"5" integer NOT NULL DEFAULT '0',
	CONSTRAINT "ratings_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "photos" ADD CONSTRAINT "photos_fk0" FOREIGN KEY ("review_id") REFERENCES "reviews"("review_id");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("product_id") REFERENCES "product"("product_id");
ALTER TABLE "characteristics" ADD CONSTRAINT "characteristics_fk0" FOREIGN KEY ("product_id") REFERENCES "product"("product_id");
ALTER TABLE "characteristic_votes" ADD CONSTRAINT "characteristic_votes_fk0" FOREIGN KEY ("characteristic_id") REFERENCES "characteristics"("characteristic_vote_id");
ALTER TABLE "recommended" ADD CONSTRAINT "recommended_fk0" FOREIGN KEY ("id") REFERENCES "product"("recommend_id");
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fk0" FOREIGN KEY ("id") REFERENCES "product"("ratings_id");