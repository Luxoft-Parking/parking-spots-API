const { get } = require('lodash');
const Spot = require('../../../models/ParkingSpot');

module.exports = {
  put: async function releaseSpot(request, h) {
    const userId = get(request, 'auth.credentials.sub');
    const [spot] = await Spot.find({ isFree: false }).or([{ assignedUser: userId }, { usedBy: userId }]);

    if (!spot) {
      return h.response().code(404);
    }
    if (spot.usedBy.toString() === userId) {
      spot.usedBy = null;
    }
    spot.isFree = true;

    await spot.save();
    return h.response().code(200);
  }
};
