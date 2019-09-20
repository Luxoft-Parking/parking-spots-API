const ExpiredJwt = require('../models/ExpiredJwt');
const { get } = require('lodash');

module.exports = async function validateJwt(decoded, request) {
  const jwt = get(request, 'auth.token');
  const hasExpired = await ExpiredJwt.exists({ jwt });

  if (hasExpired) {
    return { isValid: false };
  }
  return { isValid: true };
};
