const Spot = require('../../../../models/ParkingSpot');
const User = require('../../../../models/User');

module.exports = {
  put: {
    handler: async function (request, h) {
      const { spotId, userId } = request.params;
      const user = await User.findById(userId);
      const spot = await Spot.findById(spotId);

      if (spot.isFree) {
        if (user.spot != null) {
          const previousSpot = await Spot.findById(user.spot.id);

          previousSpot.assignedUser = null;
          previousSpot.isFree = true;
          spot.usedBy = null;
          await previousSpot.save();
        }

        user.spot = spot;
        user.hasParkingSpot = true;
        spot.assignedUser = user.id;
        spot.isFree = false;
        spot.usedBy = null;
        await user.save();
        await spot.save();
        return h.response().code(201);
      }
      return h.response().code(404);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
