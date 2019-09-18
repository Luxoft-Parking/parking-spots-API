const EmailValidation = require('../../models/EmailValidation');
const uuid = require('uuid/v4');

// const { sendRegistrationEmail } = require('../../helpers/mail');

module.exports = {
    post: {
        handler: async function (request, h) {
            const { email } = request.payload;
            const code = uuid();
            await EmailValidation.create({ email, code });
            //sendRegistrationEmail(email, code);
            console.log('code: ', code);
            return h.response('OK');
        },
        config: {
            auth: false
        }
    }
};
