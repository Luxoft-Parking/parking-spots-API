const { get } = require('lodash');
const moment = require('moment');
const User = require('../../models/User');
const CarPool = require('../../models/CarPool');
const { decipherData } = require('../../helpers/crypto');

module.exports = {
  post: {
    handler: async function registerCarpool(request, h) {
      const { qrCode } = request.payload;
      const poolerId = get(request, 'auth.credentials.sub');
      const decriptedQR = decipherData(qrCode);
      const [valid, driverId] = decriptedQR.split(':');
      const validDate = moment(valid, 'x').utcOffset('-05:00');
      const bod = moment().hour(0).minute(0).second(0).millisecond(0).utcOffset('-05:00');
      const eod = moment().hour(23).minute(59).second(59).millisecond(999).utcOffset('-05:00');
      const alreadyRegistered = await CarPool.exists({
        driver: driverId,
        carPooler: poolerId,
        date: {
          $gte: moment().subtract(3, 'hours').utcOffset('-05:00')
        }
      });

      if (alreadyRegistered) {
        //208 Already Reported (WebDAV; RFC 5842)
        return h.response().code(208);
      }

      if (poolerId !== driverId && validDate.isSame(bod, 'day')) {
        const driver = await User.findById(driverId);
        const pooler = await User.findById(poolerId);

        if (driver && pooler) {
          await CarPool.create({ driver: driver._id, carPooler: pooler._id });
          driver.reputation += 10;
          await driver.save();
          return h.response().code(201);
        }
        return h.response().code(404);
      }

      return h.response().code(400);
    },
    config: {
      auth: {
        scope: ['user', 'admin']
      }
    }
  },

};
