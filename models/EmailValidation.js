const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const EmailValidationSchema = new Schema({
  email: {
    required: true,
    type: String
  },
  code: {
    required: true,
    type: String
  },
  expiresAt: {
    required: true,
    type: Date,
    default: () => moment().add(7, 'days').hours(23).minutes(59).seconds(59).milliseconds(0).utcOffset('-06:00').toDate()
  },
  date: Date
});

module.exports = mongoose.model('EmailValidation', EmailValidationSchema);
