const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CarPoolSchema = new Schema({
    driver: {
        required: true,
        type: Schema.Types.ObjectId
    },
    carPooler: {
        required: true,
        type: Schema.Types.ObjectId
    },
    date: Date
})

module.exports = mongoose.model('CarPool', CarPoolSchema);
