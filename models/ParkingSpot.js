const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParkingSpotSchema = new Schema({
    rating: {
        required: true,
        type: Number
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
    isFree: Boolean,
    usedBy: Schema.Types.ObjectId
});

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);
