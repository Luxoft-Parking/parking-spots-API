const Spot = require('../../models/ParkingSpot');

module.exports = {
  get: {
    handler: async function getUserSpot(request, h) {

      const freeSpots = await Spot.find({ isFree: true }, 'level number').sort({ level: 'asc', number: 'asc' }).exec();

      if (freeSpots.length > 0) {
        return h.response(freeSpots);
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
