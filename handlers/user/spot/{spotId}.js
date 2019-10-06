const { get, pick } = require('lodash');
const User = require('../../../models/User');
const Spot = require('../../../models/ParkingSpot');

module.exports = {
  put: {
    handler: async function assignUserToSpot(request, h) {
      const userId = get(request, 'auth.credentials.sub');
      const parkingSpotId = get(request, 'params.spotId');
      const user = await User.findById(userId);
      const spot = await Spot.findById(parkingSpotId).and({ isFree: true });

      if (spot) {
        spot.assignedUser = userId;
        spot.usedBy = userId;
        spot.isFree = false;
        user.hasParkingSpot = true;
        user.spot = spot;
        await spot.save();
        await user.save();
        return h.response(pick(spot, ['rating', 'level', 'number'])).code(200);
      }
      return h.response().code(409);
    },
    config: {
      auth: {
        scope: ['user']
      }
    }
  },
  delete: {
    handler: async function deleteSpot(request, h) {
      const { spotId } = request.params;

      await Spot.findByIdAndDelete(spotId);
      return h.response().code(204);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
