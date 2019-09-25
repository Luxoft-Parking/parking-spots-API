const Spot = require('../../models/ParkingSpot');

module.exports = {
  put: {
    handler: async function editSpot(request, h) {
      const { spotId } = request.params;
      const spot = await Spot.findById(spotId);

      if (!spot) {
        return h.response().code(404);
      }

      const { level, number } = request.payload;

      spot.level = level;
      spot.number = number;
      await spot.save();
      return h.response(spot).code(201);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
