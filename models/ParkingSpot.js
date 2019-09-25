const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ParkingSpotSchema = new Schema({
  rating: {
    required: true,
    type: Number,
    default: 0
  },
  level: {
    required: true,
    type: String
  },
  number: {
    required: true,
    type: String
  },
  assignedUser: Schema.Types.ObjectId,
  isFree: {
    required: true,
    type: Boolean,
    default: false
  },
  usedBy: Schema.Types.ObjectId
});

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);
