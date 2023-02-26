const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TresholdId = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    tresholdId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TresholdId', TresholdId);
