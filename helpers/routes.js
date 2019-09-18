const Path = require('path');
const fs = require('fs');
const _ = require('lodash');
const debug = require('debug')('routeHelper');

module.exports.readHandlers = function (handlersRoot = 'handlers') {
    const routes = [];
    const prefix = '/v1';
    const rootDir = `${process.cwd()}/${handlersRoot}`;

    const pathComponents = [''];

    const readDir = (dirName) => {


        fs.readdirSync(dirName).forEach(
            (filename) => {

                const curFile = Path.join(dirName, filename);
                const stats = fs.statSync(curFile);

                if (stats.isFile()) {
                    const handler = require(Path.resolve(curFile));

                    _.toPairs(handler).forEach(
                        ([method, handlerFunction]) => {
                            let routeOpts = {};

                            if (typeof handlerFunction !== 'function') {
                                ({ handler: handlerFunction, ...routeOpts } = handlerFunction);
                            }
                            const p = `${prefix}${pathComponents.join('/')}/${filename.replace(/\.js$/, '')}`;
                            const route = {
                                method: method.toUpperCase(),
                                handler: handlerFunction,
                                path: p,
                                ...routeOpts
                            };
                            routes.push(route);
                            debug(`added route for ${method}: ${p}`);
                            debug(route);
                        }
                    );
                } else if (stats.isDirectory()) {
                    pathComponents.push(filename);
                    readDir(Path.resolve(curFile));
                    pathComponents.pop();
                }
            }
        );
    };
    readDir(rootDir);
    return routes;
};

