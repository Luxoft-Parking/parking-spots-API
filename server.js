const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const { readHandlers } = require('./helpers/routes');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: 'ohsosecret',
        validate: require('./auth/jwt'),
        verifyOptions: {
            algorithms: ['HS256']
        },
        headerKey: 'x-user-jwt'
    });

    server.auth.default('jwt');
    server.ext('onPreResponse', (request, h) => {
        if (!request.response.isBoom)
            request.response.headers['x-user-jwt'] = request.auth.token || '';
        return h.continue;
    });
    server.route(readHandlers());
    await mongoose.connect('mongodb+srv://bubach:V0x_EcN%40@luxoft-parking-g1db5.mongodb.net/parking?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
