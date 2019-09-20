const { get } = require('lodash');
const ExpiredJwt = require('../../models/ExpiredJwt');

/**
 * Operations on /user/logout
 */
module.exports = {
  /**
     * summary: Logs out user
     * description:
     * parameters:
     * produces: application/xml, application/json
     * responses: default
     */
  get: async function logoutUser(request, h) {
    const jwt = get(request, 'headers["x-user-jwt"]');

    if (jwt && !(await ExpiredJwt.exists({ jwt: jwt }))) {
      await ExpiredJwt.create({ jwt });
    }
    return h.response('OK');
  }
};
