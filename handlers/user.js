const User = require('../models/User');
const Spot = require('../models/ParkingSpot');

module.exports = {
  get: async function listUsers(request, h) {
    let users = await User.find({}, 'fullName username isDriver hasParkingSpot reputation isValidEmail team spot').exec();

    // users = users.map((user) => user.toObject());

    // for (const user of users) {
    //   if (user.hasParkingSpot) {
    //     const spot = await Spot.find({ assignedUser: user._id }, 'level number');

    //     if (spot.length > 0)
    //       user.spot = spot[0].toObject();
    //   }
    // }
    return h.response(users);
  },
  post: async function addUser(request, h) {
    try {
      const newUser = await User.create({ ...request.payload, roles: ['user'] });

      return h.response(newUser);
    } catch (error) {
      return h.response({ error }).code(500);
    }
  }
};
