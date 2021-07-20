const express = require('express');
const router = express.Router();
const priceService = require('services/price.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertPrice);
router.post('/update', updatePrice);
router.get('/', getAllPrices);
router.get('/:id', getById);
router.put('/bulk', editPrices);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      PriceResponse:
 *          type: object
 *          properties:
 *              vatIncluded:
 *                  type: boolean
 *                  example: true
 *              _id:
 *                  type: string
 *                  example: 60d5e02078fb5d24e071ca55
 *              unit_id:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 *              product_id:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 *              price:
 *                  type: number
 *                  example: 25000
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-13T10:50:21.950Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-13T10:50:21.950Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60ed6fed8d8ade206007870e            
 */

/**
 * @swagger
 * /price:
 *  get:
 *      description: Find the prices for all products
 *      summary: Get all prices
 *      tags:
 *          - Prices
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:            
 *                          type: object
 *                          properties:
 *                              vatIncluded:
 *                                  type: boolean
 *                                  example: true
 *                              _id:
 *                                  type: string
 *                                  example: 60d5e02078fb5d24e071ca55
 *                              unit_id:
 *                                  $ref: '#/components/schemas/UnitResponse'
 *                              product_id:
 *                                  $ref: '#/components/schemas/ProductResponse'
 *                              price:
 *                                  type: number
 *                                  example: 25000
 *                              createdDate:
 *                                  type: string
 *                                  example: 2021-07-13T10:50:21.950Z
 *                              updatedDate:
 *                                  type: string
 *                                  example: 2021-07-13T10:50:21.950Z
 *                              __v:
 *                                  type: number
 *                                  example: 0
 *                              id:
 *                                  type: string
 *                                  example: 60ed6fed8d8ade206007870e
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllPrices(req, res, next) {
    priceService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

/**
 * @swagger
 * /price:
 *  post:
 *      description: Create prices for a product
 *      summary: Create price
 *      tags: 
 *          - Prices
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          product_id: 
 *                              type: string
 *                          price: 
 *                              type: number
 *                          unit_id:
 *                              type: string
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PriceResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertPrice(req, res, next) {
    priceService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /price/update:
 *  post:
 *      description: Update the product prices
 *      summary: Update prices
 *      tags:
 *          - Prices
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
 *                          price:
 *                              type: number
 *      responses:
 *          200: 
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function updatePrice(req, res, next) {
    priceService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /price/{id}:
 *  get:
 *      description: Get product prices by product id
 *      summary: Get product prices by id
 *      tags:
 *          - Prices
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: product id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PriceResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message 
 *          
 */
function getById(req, res, next) {
    console.log(req.params.id)
    priceService.getByProductId(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function editPrices(req, res, next) {
    if (req.body.length > 0) {
        priceService.updateBulk(req.body)
            .then(price => price ? res.json(price) : res.sendStatus(404))
            .catch(err => next(err));
    } else {
        res.status(400)
        res.json({
            "message": "EXPECTS A JSON ARRAY",
            "code": 400,
            "reuiredFormat": [{
                "productCode": "STRING",
                "price": "NUMBER",
                "unitName": "STRING"
            }],
            "example": [
                {
                    "productCode": "abc123",
                    "price": 100,
                    "unitName": "xyz123"
                },
                {
                    "productCode": "def456",
                    "price": 200,
                    "unitName": "test unit"
                }
            ]
        })
    }


}
