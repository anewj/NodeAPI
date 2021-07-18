const express = require('express');
const router = express.Router();
const productService = require('services/product.service');
const priceService = require('services/price.service');
const stockService = require('services/stock.service');
const mongoose = require('mongoose');
const authorize = require('_helpers/authorize');


var fs = require('fs');

// routes
router.post('/', newProduct);
router.get('/', getAllProducts);
router.get('/count', getProductsCount);
router.get('/psf', getByPagingSortingFiltering);
router.get('/query/:field&:id', getByManufacturer);
router.get('/preOrder/:preOrder', getProducts);
router.get('/stock/:id', getStock);
router.get('/price/:id', getPrice);
router.get('/:id', getById);
router.post('/update', updateProduct);
router.post('/bulk', saveBulkProducts);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      ProductResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f3eeb8bd753611f42a1e24
 *              code:
 *                  type: string
 *                  example: TV
 *              name:
 *                  type: string
 *                  example: Television
 *              units:
 *                  type: array 
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: 60f3eeb8bd753611f42a1e25
 *                          position:
 *                              type: number
 *                              example: 0
 *                          unit:
 *                              type: string
 *                              example: 60d5df7378fb5d24e071ca4e
 *                          rate: 
 *                              type: number
 *                              example: 10000
 *              vendor:
 *                  type: string
 *                  example: 60d5d3b978fb5d24e071ca1b
 *              defaultSellingUnit:
 *                  type: string
 *                  example: 60d5df7378fb5d24e071ca4e
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60f3eeb8bd753611f42a1e24
 * 
 *      GetProductResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f3eeb8bd753611f42a1e24
 *              code:
 *                  type: string
 *                  example: TV
 *              name:
 *                  type: string
 *                  example: Television
 *              units:
 *                  type: array 
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: 60f3eeb8bd753611f42a1e25
 *                          position:
 *                              type: number
 *                              example: 0
 *                          rate: 
 *                              type: number
 *                              example: 10000
 *                          unit:
 *                              $ref: '#/components/schemas/UnitResponse'
 *              vendor:
 *                  $ref: '#/components/schemas/VendorResponse'
 *              defaultSellingUnit:
 *                  $ref: '#/components/schemas/UnitResponse'
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60f3eeb8bd753611f42a1e24
 *      
 *      GetProductByIdResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f3eeb8bd753611f42a1e24
 *              code:
 *                  type: string
 *                  example: TV
 *              name:
 *                  type: string
 *                  example: Television
 *              units:
 *                  type: array 
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: 60f3eeb8bd753611f42a1e25
 *                          position:
 *                              type: number
 *                              example: 0
 *                          rate: 
 *                              type: number
 *                              example: 10000
 *                          unit:
 *                              $ref: '#/components/schemas/UnitResponse'
 *              vendor:
 *                  $ref: '#/components/schemas/VendorResponse'
 *              defaultSellingUnit:
 *                  $ref: '#/components/schemas/UnitResponse'
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-18T09:04:56.520Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              price:
 *                  $ref: '#/components/schemas/GetPriceResponse'
 *              stock:
 *                  $ref: '#/components/schemas/GetStockResponse'
 * 
 *      GetPriceResponse:
 *          type: object
 *          properties:
 *              vatIncluded:
 *                  type: boolean
 *                  example: true
 *              _id:
 *                  type: string
 *                  example: 60d5e02078fb5d24e071ca55
 *              unit_id:    
 *                  $ref: '#/components/schemas/UnitResponse'
 *              product_id:
 *                  type: string
 *                  example: 60d5e01f78fb5d24e071ca52
 *              price:
 *                  type: number
 *                  example: 25000
 *              createdDate:
 *                  type: string
 *                  example: 2021-06-25T13:54:40.263Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-25T13:54:40.263Z
 *              __v: 
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60d5e02078fb5d24e071ca55
 * 
 *      GetStockResponse:
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
 *                  $ref: '#/components/schemas/UnitResponse'
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
 * /products:
 *  get:
 *      description: Get all products
 *      summary: Get all products
 *      tags:
 *          - Products
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
 *                              $ref: '#/components/schemas/GetProductResponse'            
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllProducts(req, res, next) {
    productService.getAll()
        .then(product => {
            res.json(product)
        })
        .catch(err => next(err));
}

/**
 * @swagger
 * /products:
 *  post:
 *      description: Create a new product
 *      summary: Create product
 *      tags:
 *          - Products
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
 *                          code:
 *                              type: string
 *                          name:
 *                              type: string
 *                          units:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      position:
 *                                          type: number
 *                                      unit:
 *                                          type: string
 *                                      rate:
 *                                          type: number
 *                          vendor:
 *                              type: string
 *                          defaultSellingUnit:
 *                              type: string
 *                      required:
 *                          - code
 *                          - name
 *                          - units
 *                          - vendor
 *                          - defaultSellingUnit
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 * 
 */
function newProduct(req, res, next) {
    productService.create(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err)

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}

function getProducts(req, res, next) {
    productService.getProduct(req.params.preOrder)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /products/count:
 *  get:
 *      description: Get the number of products
 *      summary: Count Products 
 *      tags: 
 *          - Products
 *      produces:
 *          - application/json  
 *      security: []
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: number
 *                          example: 10
 *          403:
 *              descriptions: Access token does not have the required permission   
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getProductsCount(req, res, next) {
    productService.getProductsCount(req.params.preOrder)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByPagingSortingFiltering(req, res, next) { 
    productService.getByPagingSortingFiltering(req.query)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /products/{id}:
 *  get:
 *      description: Find products by product id
 *      summary: Get products by id
 *      tags: 
 *          - Products
 *      produces:
 *          - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product Id
 *          required: true
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetProductByIdResponse'
 *          403: 
 *              description: Access token does not have the required permission 
 *          500:
 *              description: Internal Server Error or Custom Error Message   
 */
function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /products/stock/{id}:
 *  get:
 *      description: Find stocks of a product
 *      summary: Get product stock 
 *      tags:
 *          - Products
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product Id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetStockResponse'
 *          403: 
 *              description: Access token does not have the required permission 
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */ 
function getStock(req, res, next) {
    productService.getStock(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /products/price/{id}:
 *  get:
 *      description: Find price of a product
 *      summary: Get product price 
 *      tags:
 *          - Products
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product Id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetPriceResponse'
 *          403: 
 *              description: Access token does not have the required permission 
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */ 
function getPrice(req, res, next) {
    productService.getPrice(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByManufacturer(req, res, next) {

    var query ={};
    query[req.params.field] = req.params.id;

    productService.getByManufacturer(query)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @swagger
 * /products/update:
 *  post:
 *      description: Update product details
 *      summary: Update product
 *      tags:
 *          - Products
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
 *                          code:
 *                              type: string
 *                          name:
 *                              type: string
 *                          units:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      position:
 *                                          type: number
 *                                      unit:
 *                                          type: string
 *                                      rate:
 *                                          type: number
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          403: 
 *              description: Access token does not have the required permission 
 *          500:
 *              description: Internal Server Error or Custom Error Message
 *                              
 */
function updateProduct(req, res, next) {
    productService.update(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err);

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}

function saveBulkProducts(req, res, next) {
    productService.saveBulkProduct(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err)

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}
