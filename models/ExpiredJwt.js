const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExpiredJwtSchema = new Schema({
  jwt: {
    required: true,
    type: String
  },
  expiredAt: {
    required: true,
    type: Date,
    default: Date.now
  },
  date: Date
});

module.exports = mongoose.model('ExpiredJwt', ExpiredJwtSchema);
