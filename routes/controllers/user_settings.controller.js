const express = require('express');
const router = express.Router();
const userSettingsService = require('services/user_settings.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertSettings);
router.get('/', getAllSettings);
router.get('/:id', getByUserId);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      UserSettingsResponse:
 *          type: object
 *          properties:
 *              theme:
 *                  type: string
 *                  example: Cosmic
 *              _id:
 *                  type: string
 *                  example: 60f01e8ad2423c12e4f335d6
 *              user_id:
 *                  type: string
 *                  example: 60e26155509ff231c4e6cfe2
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-15T11:39:54.744Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-15T11:39:54.744Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60f01e8ad2423c12e4f335d6
 */

/**
 * @swagger
 * /user_settings:
 *  get:
 *      description: Get all user settings
 *      summary: Get user settings
 *      tags:
 *          - User Settings
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
 *                              $ref: '#/components/schemas/UserSettingsResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllSettings(req, res, next) {
    userSettingsService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /user_settings:
 *  post:
 *      description: Create user settings
 *      summary: Create user settings
 *      tags:
 *          - User Settings
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: string
 *                              example: 60e26155509ff231c4e6cfe2
 *                          theme:
 *                              type: string
 *                              example: COSMIC
 *                      required:
 *                          - user_id
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserSettingsResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertSettings(req, res, next) {
    userSettingsService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /user_settings/{id}:
 *  get:
 *      description: Get user settings by id
 *      summary: Get user settings by id
 *      tags:
 *          - User Settings
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: user id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UserSettingsResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getByUserId(req, res, next) {
    userSettingsService.getByUserId(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
