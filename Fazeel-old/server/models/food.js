const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Food = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    calorie: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', Food);
