const express = require('express');
const router = express.Router();
const Role = require('_helpers/role');
const userService = require('services/user.service');
const authorize = require('_helpers/authorize');
const user_roleService = require('services/user_role.service');
const roleService = require('services/role.service');
const config = require('config/config.json');


/**
 * @swagger
 * components:
 *   schemas:
 *      UserResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60d49002c9c64cb20a81d47e
 *              lastName:
 *                  type: string
 *                  example: LastName
 *              firstName:
 *                  type: string
 *                  example: FirstName
 *              username:
 *                  type: string
 *                  example: erp_user
 *              email: 
 *                  type: string
 *                  example: erpuser@gmail.com
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-11T08:24:59.660Z
 *              __v: 
 *                  type: number
 *                  example: 0
 */

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
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user_id:    
 *                                  type: string
 *                                  example: 60d49948ef61fe0300f482ce
 *                              _id:
 *                                  type: string
 *                                  example: 60d49002c9c64cb20a81d47e
 *                              lastName:
 *                                  type: string
 *                                  example: LastName
 *                              firstName:
 *                                  type: string
 *                                  example: FirstName
 *                              username:
 *                                  type: string
 *                                  example: erp_user
 *                              email: 
 *                                  type: string
 *                                  example: erpuser@gmail.com
 *                              createdDate:
 *                                  type: string
 *                                  example: 2021-07-11T08:24:59.660Z
 *                              __v: 
 *                                  type: number
 *                                  example: 0
 *                              token: 
 *                                  type: string
 *                                  example: eyJfaasfI1NiIsInmkjjjJ9.eyJzdWIiOiI2MGQ0OTk0OGVmNjFmZTAzMDBmNDgyY2fasdfxlIjoic3VwZXJfYWRasdfasgrhasiOjE2MjU5OTE4OTl9.FoasdfasdgEeZmgi9YOXRtCjplqRi-gasdfasbadfg
 *                              role:
 *                                  type: string
 *                                  example: Admin
 *                              updatedDate: 
 *                                  type: string
 *                                  example: 2021-07-11T08:24:59.660Z
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
router.post('/authenticate', authenticate);
// router.post('/register', authorize([Role.SuperAdmin, Role.Admin]), register);
router.post('/register', register);
router.get('/', authorize([Role.SuperAdmin, Role.Admin]), getAll); // admin only
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize([Role.SuperAdmin, Role.Admin]), getById);       // all authenticated users
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

/**
 * Register User
 * 
 * @swagger
 * /users/register:
 *  post:
 *      description: Register New User.
 *      summary: User Sign-up
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
 *                          lastName:
 *                              type: string
 *                          firstName:
 *                              type: string
 *                          password:
 *                              type: string
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                      required:
 *                          - lastName
 *                          - firstName
 *                          - password
 *                          - username
 *                          - email
 *                      example:
 *                          lastName: user
 *                          firstName: test
 *                          password: erp_password
 *                          username: erp_user
 *                          email: testuser@gmail.com
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: string
 *                                  example: User Created
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
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

/**
 * Find all users.
 * 
 * @swagger
 * /users:
 *  get:
 *      description: Return all users.
 *      summary: Find all users.
 *      tags:
 *        - Users
 *      security: 
 *        - jwt: []
 *      produces:
 *        - application/json
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UserResponse'      
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message    
 */
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

/**
 * Get current user
 * 
 * @swagger
 * /users/current:
 *  get:
 *      description: Find the current user  
 *      summary: Find current user
 *      tags:
 *          - Users
 *      security:
 *          - jwt: []
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * All authenticated users.
 * 
 * @swagger
 * /users/{UserId}:
 *  get:
 *      description: returns all authenticated users.
 *      summary: All authenticated users.
 *      tags:
 *        - Users
 *      security:
 *        - jwt: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: UserId
 *          descriptions: User Id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    console.log(req.user);

    // only allow admins to access other user records
    if (id !== currentUser.sub) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * Update user
 * 
 * @swagger
 * /users/{UserId}:
 *  put:
 *      description: Update username and password of users.
 *      summary: Update user.
 *      tags:
 *        - Users
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: UserId
 *          descriptions: User Id
 *          required: true
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
 *      responses:
 *          200:
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */


function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

/**
 * Delete user
 * 
 * @swagger
 * /users/{UserId}:
 *  delete:
 *      description: deletes a user
 *      summary: delete user
 *      tags:
 *        - Users
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: UserId
 *          descriptions: User Id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
