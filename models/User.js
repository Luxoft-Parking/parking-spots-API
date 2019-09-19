const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        type: Boolean
    },
    hasParkingSpot: {
        required: true,
        type: Boolean,
        default: false
    },
    startDate: {
        required: true,
        type: Date,
    },
    reputation: {
        required: true,
        type: Number
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
    }
});

module.exports = mongoose.model('User', UserSchema);
