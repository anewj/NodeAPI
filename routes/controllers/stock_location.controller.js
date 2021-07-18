const express = require('express');
const router = express.Router();
const stockLocationService = require('services/stock_location.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertStockLocation);
router.get('/', getAllStocksLocation);
router.get('/:id', getById);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      StockLocationResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f0228e0b88a819b4067ca9
 *              name:
 *                  type: string
 *                  example: warehouse
 *              code:
 *                  type: string
 *                  example: WH1
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-15T11:57:02.573Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-15T11:57:02.573Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60f0228e0b88a819b4067ca9
 */

/**
 * @swagger
 * /stock_location:
 *  get:
 *      description: Find all stock locations
 *      summary: Find all stock locations
 *      tags:
 *          - Stock Locations
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
 *                              $ref: '#/components/schemas/StockLocationResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllStocksLocation(req, res, next) {
    stockLocationService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /stock_location:
 *  post:
 *      description: Create stock location
 *      summary: Create stock location
 *      tags:
 *          - Stock Locations
 *      produces:   
 *          - application/json
 *      security: []
 *      requestBody:
 *          content:
 *              application/json: 
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          code:
 *                              type: string
 *                      required:
 *                          - name
 *                          - code
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/StockLocationResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertStockLocation(req, res, next) {
    stockLocationService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /stock_location/{id}:
 *  get:
 *      description: Find stock location by id
 *      summary: Find stock location by id
 *      tags:
 *          - Stock Locations
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: stock location id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/StockLocationResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    stockLocationService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
