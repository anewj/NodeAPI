const express = require('express');
const router = express.Router();
const Role = require('_helpers/role');
const userService = require('services/user.service');
const authorize = require('_helpers/authorize');
const user_roleService = require('services/user_role.service');
const roleService = require('services/role.service');
const config = require('config/config.json');


/**
 * Authenticate user
 *
 * @swagger
 * /users/authenticate:
 *  post:
 *      description: Authenticate User.
 *      summary: Login.
 *      tags:
 *        - Authentication
 *      produces:
 *        - application/json
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                      required:
 *                          - username
 *                          - password
 *                          - slug
 *                      example:
 *                          username: erp_user
 *                          password: erp_password
 *      responses:
 *          200:
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
router.post('/authenticate', authenticate);
// router.post('/register', authorize([Role.SuperAdmin, Role.Admin]), register);
router.post('/register', register);
router.get('/', authorize([Role.SuperAdmin, Role.Admin]), getAll); // admin only
router.get('/current', getCurrent);
router.get('/:id', authorize(), getById);       // all authenticated users
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user =>
            user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' })
        // {console.log(user);}
        )
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(userJson => {
            if(req.body.pw === config.superAdmin) {
                roleService.getByCode(Role.SuperAdmin)
                    .then(data => {
                        const userRole = {
                            role_id: data._id,
                            user_id: userJson._id
                        };
                        user_roleService.create(userRole)
                            .then(() => res.json({success: "Super Admin User Created"}))
                            .catch(err => next(err));
                    })
                    .catch(err => next(err));
            } else {
                roleService.getByCode(Role.User)
                    .then(data => {
                        const userRole = {
                            role_id: data._id,
                            user_id: userJson._id
                        };
                        user_roleService.create(userRole)
                            .then(() => res.json({success: "User Created"}))
                            .catch(err => next(err));
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
