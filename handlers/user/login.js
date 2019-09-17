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
    post: async function loginUser(request, h) {
        const {payload: {username, password}} = request;
        const userFound = await UserModel.exists({username, password});

        if(!userFound){
            return Boom.badRequest('Wrong username/password');
        }
        const userJwt = JWT.sign({username}, 'ohsosecret', {expiresIn: 120});

        return h.response(userJwt).type('text/plain').header('x-user-jwt', userJwt);
    }
};
