const express = require('express');
const router = express.Router();
const manufacturerService = require('services/manufacturer.service');
var fs = require('fs');

// routes
router.post('/', add);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
/**
 * @swagger
 * components:
 *  schemas:
 *      ManufacturerResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60ee939b93922634f8dd4557
 *              manufacturer:
 *                  type: string
 *                  example: sony
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-14T07:34:51.030Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-14T07:34:51.030Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60ee939b93922634f8dd4557
 */

/**
 * @swagger
 * /manufacturer:
 *  get:
 *      description: Find all manufacturers
 *      summary: Get manufacturers
 *      tags:
 *          - Manufacturer
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
 *                              $ref: '#/components/schemas/ManufacturerResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAll(req, res, next) {
    manufacturerService.getAll()
        .then(manufacturer => res.json(manufacturer))
        .catch(err => next(err));
}

/**
 * @swagger
 * /manufacturer:
 *  post:
 *      description: Create a manufacturer
 *      summary: Create manufacturer
 *      tags:
 *          - Manufacturer
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *          content:    
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          manufacturer:   
 *                              type: string
 *                              example: manufacturer_name
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ManufacturerResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function add(req, res, next) {
    manufacturerService.create(req.body)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}

/**
 * @swagger
 * /manufacturer/{id}:
 *  get:
 *      description: Find manufacturer by id
 *      summary: Get manufacturer by id
 *      tags:
 *          - Manufacturer
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: manufacturer id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ManufacturerResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    manufacturerService.get(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}