const UserModel = require('../../models/User');

module.exports = {
    get: async function listUsers(request, h) {
        const users = await UserModel.find({}, 'roles hasParkingSpot fullName username active reputation').exec();
        return h.response(users);
    }
};
