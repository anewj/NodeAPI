const expressJwt = require('express-jwt');
const config = require('../config/config.json');
const userService = require('../services/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            // '/',
            '/users/authenticate',
            '/users/register',
            //use regex to include whole folder
            /\/products/i,
            /\/carousel/i,
            /\/manufacture/i,
            /\/cart/i,
            /\/role/i,
            /\/userRoles/i,
            /\/users/i,
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
