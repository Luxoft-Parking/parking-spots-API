const ParkingSpotModel = require('../models/ParkingSpot');
/**
 * Operations on /user/login
 */
module.exports = {

    /**
     * summary: Logs user into the system
     * description: Returns a valid JWT to use in further requests
     * parameters: body
     * produces: application/json
     * responses: 200, 400
     */
    get: async function listSpots(request, h) {


        const spots = await ParkingSpotModel.find({}).exec();

        return h.response(spots);
    }
};
