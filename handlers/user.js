const User = require('../models/User');

module.exports = {
  get: async function listUsers(request, h) {
    const users = await User.find({}, 'fullName username isDriver hasParkingSpot reputation isValidEmail team').exec();

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
