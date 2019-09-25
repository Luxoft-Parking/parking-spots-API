const User = require('../../models/User');

module.exports = {
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
      return h.reponse().code(204);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
