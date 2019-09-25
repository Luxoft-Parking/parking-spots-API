const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AssociatedSpotSchema = new Schema({
  level: {
    required: true,
    type: String
  },
  number: {
    required: true,
    type: Number
  }
});
const UserSchema = new Schema({
  fullName: {
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  roles: {
    required: true,
    type: [String]
  },
  active: {
    required: true,
    type: Boolean,
    default: true
  },
  hasParkingSpot: {
    required: true,
    type: Boolean,
    default: false
  },
  startDate: {
    required: true,
    type: Date,
    default: Date.now
  },
  reputation: {
    required: true,
    type: Number,
    default: 0
  },
  isDriver: {
    type: Boolean,
    required: true,
    default: false
  },
  isValidEmail: {
    required: true,
    type: Boolean,
    default: false
  },
  team: {
    required: true,
    type: String
  },
  spot: AssociatedSpotSchema

});

module.exports = mongoose.model('User', UserSchema);
