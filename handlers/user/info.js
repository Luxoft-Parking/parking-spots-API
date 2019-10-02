const { get } = require('lodash');
const moment = require('moment');
const User = require('../../models/User');
const { cipherData } = require('../../helpers/crypto');

module.exports = {
  get: {
    handler: async (request, h) => {
      const userId = get(request, 'auth.credentials.sub');
      const user = await User.findById(userId, 'fullName isDriver');

      if (!user)
        return h.response().code(404);

      const today = new moment().hours(0).minutes(0).seconds(0).milliseconds(0).utcOffset(-60 * 5).format('x');
      const qrCodeData = cipherData(`${today}:${userId}`);

      return h.response({ fullName: user.fullName, isDriver: user.isDriver, qrCodeData });
    },
    config: {
      auth: {
        scope: ['admin', 'user']
      }
    }
  }
};
