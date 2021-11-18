import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  review: {
    _id: Number,
    product_id:  Number,
    rating: Number,
    body: String,
    summary: String,
    recommended: Boolean,
    response: String,
    helpful: Number,
    reviewer_name: String,
    reported: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    photos: [{ url: String, id: Number }],
  },

  product: {
    _id: Number,
    recommended: {
      true_vote: Number,
      false_vote: Number
    },
    ratings: {
      1: {type: Number, default: 0},
      2: {type: Number, default: 0},
      3: {type: Number, default: 0},
      4: {type: Number, default: 0},
      5: {type: Number, default: 0},
    },
    characteristics: [{ characteristic_id: Number, total_vote: Number, total_score: Number}]
  },

  characteristics_list: {
    _id: Number,
    name: String,
  }
});