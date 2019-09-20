const { get } = require('lodash');
const EmailValidation = require('../../../models/EmailValidation');
const User = require('../../../models/User');

module.exports = {
  get: {
    handler: async function validateUser(request, h) {
      const code = get(request, 'params.code');
      const emailValidation = await EmailValidation.findOne({ code });

      if (emailValidation) {
        const user = await User.findOne({ username: emailValidation.email });

        user.isValidEmail = true;
        await user.save();
        await EmailValidation.findByIdAndDelete(emailValidation.id);
      }
      return h.response('OK');
    },
    config: {
      auth: false
    }
  }
};
