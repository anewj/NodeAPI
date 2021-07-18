const express = require('express');
const router = express.Router();
const roleService = require('services/role.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertRole);
router.get('/', getAllRoles);
router.get('/:id', getById);
router.get('/code/:code', getByCode);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      RoleResponse:
 *          type: object
 *          properties:
 *              _id:    
 *                  type: string
 *                  example: 60d49002c9c64cb20a81d47d
 *              role: 
 *                  type: string
 *                  example: Admin
 *              code: 
 *                  type: string
 *                  example: admin
 *              createdDate: 
 *                  type: string
 *                  example: 2021-07-11T09:40:40.349Z
 *              updatedDate: 
 *                  type: string
 *                  example: 2021-07-11T09:40:40.349Z
 *              id: 
 *                  type: string
 *                  example: 60d49002c9c64cb20a81d47d
 */

/**
 * @swagger
 * /role:
 *  get:
 *      description: Get all roles
 *      summary: Get all roles
 *      tags:
 *          - Role
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/RoleResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllRoles(req, res, next) {
    roleService.getAll()
        .then(role => res.json(role))
        .catch(err => next(err));
}

/**
 * @swagger
 * /role:
 *  post:
 *        description: Create a role
 *        summary: insert role
 *        tags:
 *            - Role  
 *        produces:
 *            - application/json  
 *        security: []
 *        requestBody:
 *            content:
 *                 application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              role:
 *                                  type: string
 *                                  example: Admin
 *                              code:
 *                                  type: string
 *                                  example: admin
 *        responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/RoleResponse'
 *             403:
 *                 description: Access token does not have the required permission
 *             500:
 *                 description: Internal Server Error or Custom Error Message
 */
function insertRole(req, res, next) {
    roleService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /role/{id}:
 *  get:
 *      description: get role by id
 *      summary: get role by id
 *      tags:
 *          - Role
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *          - in: path
 *            name: id
 *            description: role id
 *            required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoleResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    roleService.getById(req.params.id)
        .then(role => role ? res.json(role) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /role/code/{code}:
 *  get:
 *      description: get role by code
 *      summary: get role by code
 *      tags:
 *          - Role
 *      produces:
 *          - application/json 
 *      security: [] 
 *      parameters:
 *          - in: path  
 *            name: code
 *            description: role code
 *            required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RoleResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getByCode(req, res, next) {
    roleService.getByCode(req.params.code)
        .then(role => role ? res.json(role) : res.sendStatus(404))
        .catch(err => next(err));
}
