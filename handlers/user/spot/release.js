const { get } = require('lodash');
const Spot = require('../../../models/ParkingSpot');
const User = require('../../../models/User');
const { sendFreeParkingNotifications } = require('../../../helpers/pushNotifications');

module.exports = {
  put: {
    handler: async function releaseSpot(request, h) {
      const userId = get(request, 'auth.credentials.sub');
      const [spot] = await Spot.find({ isFree: false }).or([{ assignedUser: userId }, { usedBy: userId }]);

      if (!spot) {
        return h.response().code(404);
      }
      if (spot.usedBy && spot.usedBy.toString() === userId) {
        spot.usedBy = null;
      }
      spot.isFree = true;

      await spot.save();
      const users = await User.find({ hasParkingSpot: false, isDriver: true, expoToken: { $exists: true, $ne: '' } });

      sendFreeParkingNotifications(users, spot.id.toString());
      return h.response().code(201);
    },
    config: {
      auth: {
        scope: ['user']
      }
    }
  }
};
