const UserModel = require('../models/User');

module.exports = {
    get: async function listUsers(request, h) {
        const users = await UserModel.find({}, 'fullName username isDriver hasParkingSpot reputation isValidEmail team').exec();
        return h.response(users);
    }
};
