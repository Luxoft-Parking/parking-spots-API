const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const UserModel = require('../../models/User');

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
  post: {
    handler: async function loginUser(request, h) {
      const { payload: { username, password, expoToken = '' } } = request;
      const user = await UserModel.findOne({ username, password, isValidEmail: true });

      if (!user) {
        return Boom.badRequest('Wrong username/password');
      }

      if (expoToken) {
        user.expoToken = expoToken;
        user.save();
      }

      const userJwt = JWT.sign({ username, scope: user.roles.toObject() }, 'ohsosecret', { expiresIn: '7 days', subject: user.id });

      return h.response(userJwt).type('text/plain').header('x-user-jwt', userJwt);
    },
    config: {
      auth: false
    }
  }
};
