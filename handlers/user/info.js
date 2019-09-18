const { get } = require('lodash');
const moment = require('moment');

const User = require('../../models/User');

const { cipherData, decipherData } = require('../../helpers/crypto');
module.exports = {
    get: async (request, h) => {
        const userId = get(request, 'auth.credentials.sub');
        const user = await User.findById(userId, 'fullName isDriver');
        const today = new moment().hours(0).minutes(0).seconds(0).format('x');
        const qrCodeData = cipherData(`${today}${user.id}${today.split('').reverse().join('')}`);
        console.log(`${today}${user.id}${today.split('').reverse().join('')}`);
        console.log(qrCodeData);
        console.log(decipherData(qrCodeData));
        return h.response({ fullName: user.fullName, isDriver: user.isDriver, qrCodeData });

    }
};
