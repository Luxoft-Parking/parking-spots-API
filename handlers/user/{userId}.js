const User = require('../../models/User');
const { pick } = require('lodash');

module.exports = {
  get: {
    handler: async function getUserInfo(request, h) {
      const { userId } = request.params;
      const user = await User.findById(userId);

      if (user) {
        return h.response(pick(user, ['username', 'fullName'])).code(200);
      }
      else {
        return h.response().code(404);
      }
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  },
  put: {
    handler: async function editUser(request, h) {
      const { userId } = request.params;
      const { fullName, username, password, isDriver, team } = request.payload;
      const user = await User.findById(userId);

      if (!user) {
        return h.response().code(404);
      }
      user.username = username;
      user.fullName = fullName;
      user.isDriver = isDriver;
      user.team = team;
      if (password) {
        user.password = password;
      }
      await user.save();
      return h.response(user).code(201);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  },
  delete: {
    handler: async function deleteUser(request, h) {
      const { userId } = request.params;

      await User.findByIdAndDelete(userId);
      return h.response().code(204);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
