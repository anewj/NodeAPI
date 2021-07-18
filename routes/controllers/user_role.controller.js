const express = require('express');
const router = express.Router();
const user_roleService = require('services/user_role.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertUserRole);
router.get('/', getAllUserRoles);
router.get('/:id', getById);
router.get('/code/:code', getByCode);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      UserRolesResponse:
 *          type: object
 *          properties:
 *              _id:    
 *                  type: string
 *                  example: 60d5e4a178fb5d24e071ca76
 *              role_id:
 *                  type: string
 *                  example: 60d49002c9c64cb20a81d47f
 *              user_id:
 *                  type: string
 *                  example: 60d5e4a078fb5d24e071ca73
 *              createdDate:
 *                  type: string
 *                  example: 2021-06-25T14:13:53.451Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-25T14:13:53.451Z
 *              __v:
 *                  type: number    
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60d5e4a178fb5d24e071ca76
 */

/**
 * @swagger
 * /userRoles:
 *  get:
 *      description: Find all user roles.
 *      summary: All user roles.    
 *      tags:
 *        - User Roles
 *      produces:
 *        - application/json    
 *      security: []
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UserRolesResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message  
 *              
 */
function getAllUserRoles(req, res, next) {
    user_roleService.getAll()
        .then(user_role => res.json(user_role))
        .catch(err => next(err));
}

/**
 * @swagger
 * /userRoles:
 *  post:
 *      description: Insert a new user role
 *      summary: Insert Role
 *      tags:
 *        - User Roles
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
 *                          role_id: 
 *                              type: string
 *                              example: 60d49002c9c64cb20a81d47f
 *                          user_id:
 *                              type: string
 *                              example: 60f156708402bf2624bc382f
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserRolesResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertUserRole(req, res, next) {
    user_roleService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /userRoles/{id}:
 *  get:
 *      description: Find user role by id
 *      summary: User Role by id
 *      tags:
 *        - User Roles
 *      produces:
 *        - application.json    
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          descriptions: User role id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserRolesResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    user_roleService.getById(req.params.id)
        .then(user_role => user_role ? res.json(user_role) : res.sendStatus(404))
        .catch(err => next(err));
}
function getByCode(req, res, next) {
    user_roleService.get(req.params.id)
        .then(user_role => user_role ? res.json(user_role) : res.sendStatus(404))
        .catch(err => next(err));
}
