const express = require('express');
const router = express.Router();
const vendorService = require('services/vendor.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertVendor);
router.get('/', getAllVendors);
router.get('/:id', getById);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      VendorResponse:
 *          type: object
 *          properties:
 *              _id:    
 *                  type: string
 *                  example: 60d5d3b978fb5d24e071ca1b
 *              name:
 *                  type: string
 *                  example: SAMSUNG
 *              code:
 *                  type: string
 *                  example: 001
 *              contactNumber:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id: 
 *                              type: string
 *                              example: 60d5d3b978fb5d24e071ca1c
 *                          number:
 *                              type: number
 *                              example: 1425145123
 *              emailAddress:
 *                  type: string
 *                  example: test@samsung.com
 *              address:
 *                  type: string
 *                  example: Test Address
 *              PAN:
 *                  type: number
 *                  example: 1231513512
 *              createdDate:
 *                  type: string
 *                  example: 2021-06-25T13:01:45.732Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-25T13:01:45.732Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60d5d3b978fb5d24e071ca1b
 */

/**
 * @swagger
 * /vendor:
 *  get:
 *      description: Find all vendors
 *      summary: Get vendors
 *      tags:
 *          - Vendor
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
 *                              $ref: '#/components/schemas/VendorResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllVendors(req, res, next) {
    vendorService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /vendor:
 *  post:
 *      description: Create a vendor
 *      summary: Create vendor
 *      tags:
 *          - Vendor
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
 *                              example: SAMSUNG
 *                          code:
 *                              type: string
 *                              example: 001
 *                          contactNumber:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      number:
 *                                          type: number
 *                                          example: 123123145
 *                          emailAddress:
 *                              type: string
 *                              example: test@samsung.com
 *                          address:
 *                              type: string
 *                              example: Test Address
 *                          PAN:
 *                              type: string  
 *                              example: 114151412      
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VendorResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertVendor(req, res, next) {
    vendorService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /vendor/{id}:
 *  get:
 *      description: Find vendors by id
 *      summary: Get vendor by id
 *      tags:
 *          - Vendor
 *      produces:
 *          - application/json 
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: vendor id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VendorResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getById(req, res, next) {
    vendorService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
