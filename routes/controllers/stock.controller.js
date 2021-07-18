const express = require('express');
const router = express.Router();
const stockService = require('services/stock.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertStock);
router.post('/update', update);
router.get('/', getAllStocks);
router.get('/:id', getById);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      StockResponse:
 *          type: object
 *          properties:
 *              lowStock:
 *                  type: object
 *                  properties:
 *                      warn:
 *                          type: boolean
 *                          example: true
 *                      quantity:
 *                          type: number
 *                          example: 5
 *              midStock:
 *                  type: object
 *                  properties:
 *                      warn: 
 *                          type: boolean
 *                          example: true
 *                      quantity: 
 *                          type: number
 *                          example: 10
 *              quantity:
 *                  type: number
 *                  example: 100
 *              availableQuantity:
 *                  type: number
 *                  example: 80
 *              _id:    
 *                  type: string
 *                  example: 60e7f47eaf2b03269cb02094
 *              product_id: 
 *                  type: string
 *                  example: 60d5e01f78fb5d24e071ca52
 *              unit_id:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-09T07:02:22.724Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-09T07:02:22.724Z
 *              __v: 
 *                  type: number
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60e7f47eaf2b03269cb02094
 */

/**
 * @swagger
 * /stock:
 *  get:
 *      description: Get all stocks
 *      summary: All stocks
 *      tags:
 *        - Stocks
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
 *                              $ref: '#/components/schemas/StockResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllStocks(req, res, next) {
    stockService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /stock:
 *  post:
 *      description: Create a stock for a product
 *      summary: Create stock
 *      tags:
 *        - Stocks
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
 *                          product_id:
 *                              type: string
 *                          quantity:
 *                              type: string
 *                          availableQuantity:
 *                              type: string
 *                          unit_id:
 *                              type: string
 *                          lowStock:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      warn:
 *                                          type: string
 *                                      quantity:
 *                                          type: integer
 *                          midStock:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      warn:
 *                                          type: string
 *                                      quantity:
 *                                          type: integer 
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/StockResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message                    
 */
function insertStock(req, res, next) {
    stockService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /stock/update:
 *  post:
 *      description: Update the stocks. 
 *      summary: Update stocks
 *      tags:
 *          - Stocks
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
 *                          _id:
 *                              type: string
 *                          quantity:
 *                              type: string
 *                          availableQuantity:
 *                              type: string 
 *                      required:
 *                          - _id
 *                          - quantity
 *                          - availableQuantity
 *                      example:
 *                          _id: stock_id
 *                          quantity: 100
 *                          availableQuantity: 50 
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/StockResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message                    
 */
function update(req, res, next) {
    stockService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /stock/{id}:
 *  get:
 *      description: Get stocks by id
 *      summary: Stocks by id
 *      tags:
 *        - Stocks
 *      produces:
 *        - application/json    
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Stock id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/StockResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    stockService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
