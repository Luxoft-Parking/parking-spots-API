const Spot = require('../models/ParkingSpot');

/**
 * Operations on /user/login
 */
module.exports = {

  get: {
    handler: async function listSpots(request, h) {

      const spots = await Spot.find({}).exec();

      return h.response(spots);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  },
  post: {
    handler: async function createSpot(request, h) {
      const { level, number } = request.payload;
      const newSpot = await Spot.create({ level, number });

      return h.response(newSpot).code(200);
    },
    config: {
      auth: {
        scope: ['admin']
      }
    }
  }
};
