const { get } = require('lodash');
const User = require('../../models/User');
const Spot = require('../../models/ParkingSpot');

module.exports = {
  get: {
    handler: async function getUserSpot(request, h) {
      const userId = get(request, 'auth.credentials.sub');
      const user = await User.findById(userId);

      if (user.hasParkingSpot) {
        const spot = await Spot.findOne({ assignedUser: userId }, 'rating level number');

        if (spot) {
          return h.response(spot).code(200);
        }

      }
      return h.response().code(404);
    },
    config: {
      auth: {
        scope: ['admin', 'user']
      }
    }
  }
};
