const express = require('express');
const router = express.Router();
const batchService = require('services/batch.service');

router.post('/', createBatch);
router.get('/:id', getById);
router.get('/product/:id', getByProductId);
router.get('/code/:code', getByCode);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      BatchResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60fa8b702063eb28e004e81e
 *              batch:
 *                  type: string
 *                  example: batch1
 *              code:
 *                  type: string
 *                  example: tst bch
 *              product_id:
 *                  $ref: '#/components/schemas/ProductResponse'
 *              purchased_price:
 *                  type: number
 *                  example: 42000
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-23T09:27:12.082Z
 *              updatedDate:
 *                  type: date
 *                  example: 2021-07-23T09:27:12.082Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60fa8b702063eb28e004e81e
 */

/**
 * @swagger
 * /batch:
 *  post:
 *      description: Create a new batch of product
 *      summary: Create batch
 *      tags:
 *          - Batch
 *      produces:
 *          - application/json
 *      security: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          batch:
 *                              type: string
 *                              example: batch1
 *                          code:
 *                              type: string
 *                              example: tst bch
 *                          product_id:
 *                              type: string
 *                              example: 60d5e01f78fb5d24e071ca52
 *                          purchased_price:
 *                              type: string
 *                              example: 45000
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string
 *                                  example: 60fa8b702063eb28e004e81e
 *                              batch:
 *                                  type: string
 *                                  example: batch1
 *                              code:
 *                                  type: string
 *                                  example: tst bch
 *                              product_id:
 *                                  type: string
 *                                  example: 60d5e01f78fb5d24e071ca52
 *                              purchased_price:
 *                                  type: number
 *                                  example: 42000
 *                              createdDate:
 *                                  type: string
 *                                  example: 2021-07-23T09:27:12.082Z
 *                              updatedDate:
 *                                  type: date
 *                                  example: 2021-07-23T09:27:12.082Z
 *                              __v:
 *                                  type: number
 *                                  example: 0
 *                              id:
 *                                  type: string
 *                                  example: 60fa8b702063eb28e004e81e
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function createBatch(req, res, next){
    batchService.create(req.body)
        .then(batch => res.json(batch))
        .catch(err => next(err))
}

/**
 * @swagger
 * /batch/{id}:
 *  get:
 *      description: Get batch by batch id
 *      summary: Get by id
 *      tags:
 *          - Batch
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: batch id
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/BatchResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next){
    batchService.getById(req.params.id)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}

/**
 * @swagger
 * /batch/product/{id}:
 *  get:
 *      description: Get batch by product id
 *      summary: Get by product id
 *      tags:
 *          - Batch
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
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/BatchResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getByProductId(req, res, next){
    batchService.getByProductId(req.params.id)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}

/**
 * @swagger
 * /batch/code/{code}:
 *  get:
 *      description: Get batch by batch code
 *      summary: Get by code
 *      tags:
 *          - Batch
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: code
 *          description: batch code
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/BatchResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getByCode(req, res, next){
    batchService.getByCode(req.params.code)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}