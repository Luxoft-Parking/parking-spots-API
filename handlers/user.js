const { Expo } = require('expo-server-sdk');
const { pick } = require('lodash');
const User = require('../models/User');

module.exports = {
  get: {
    handler: async function listUsers(request, h) {
      let users = await User.find({}, 'fullName username isDriver hasParkingSpot reputation isValidEmail team spot').exec();

      return h.response(users);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  },
  post: {
    handler: async function addUser(request, h) {
      const userData = pick(request.payload, ['fullName', 'username', 'password', 'team', 'isDriver']);

      try {
        const newUser = await User.create({ ...userData, roles: ['user'] });

        return h.response(newUser);
      } catch (error) {
        return h.response({ error }).code(500);
      }
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
