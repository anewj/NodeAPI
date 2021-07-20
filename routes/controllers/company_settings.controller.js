const express = require('express');
const router = express.Router();
const companySettingsService = require('services/company_settings.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertSettings);
router.get('/', getAllSettings);
// router.get('/:id', getByUserId);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      CompanySettingsResponse:
 *          type: object
 *          properties:
 *              information:
 *                  type: object
 *                  properties:
 *                      contactNumber:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: 60eff20dcb309037ec8a6fca
 *                                  number:
 *                                      type: number
 *                                      example: 12312412
 *              registrationInfo:
 *                  type: object
 *                  properties:
 *                      type:
 *                          type: string
 *                          example: VAT
 *                      vat_panNumber: 
 *                          type: number
 *                          example: 123124124
 *              invoiceNumberSettings: 
 *                  type: object
 *                  properties:
 *                      prefix: 
 *                          type: string
 *                          example: 2222
 *                      digits:
 *                          type: number
 *                          example: 6
 *              vatPercentage:
 *                  type: number
 *                  example: 13
 *              _id:
 *                  type: string
 *                  example: 60d72e2240a6f01da0064a25
 *              bankAccounts:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              example: 60d72e2240a6f01da0064a25
 *                          bankName:
 *                              type: string
 *                              example: testbank2
 *                          accountName:
 *                              type: string
 *                              example: testacc2
 *                          accountNumber:
 *                              type: string
 *                              example: 123142412414124124
 *                          branch:
 *                              type: string
 *                              example: teku
 *              createdDate: 
 *                  type: string
 *                  example: 2021-06-26T13:39:46.855Z
 *              updatedDate: 
 *                  type: string
 *                  example: 2021-06-26T13:39:46.855Z
 *              __v: 
 *                  type: number
 *                  example: 0
 *              id: 
 *                  type: string
 *                  example: 60d72e2240a6f01da0064a25
 */             
/**
 * @swagger
 * /company_settings:
 *  get:
 *      description: Show the company settings
 *      summary: Get company settings
 *      tags:
 *          - Company Settings
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
 *                              $ref: '#/components/schemas/CompanySettingsResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllSettings(req, res, next) {
    companySettingsService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

/**
 * @swagger
 * /company_settings:
 *  post:
 *      description: Create company settings
 *      summary: Insert company settings
 *      tags:
 *          - Company Settings
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
 *                          information:
 *                              type: object
 *                              properties:
 *                                  contactNumber:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              number:
 *                                                  type: number
 *                          registrationInfo:
 *                              type: object
 *                              properties:
 *                                  type: 
 *                                      type: string
 *                                  vat_panNumber: 
 *                                       type: number
 *                          invoiceNumberSettings:
 *                              type: object
 *                              properties:
 *                                  prefix:
 *                                      type: string
 *                                  digits:
 *                                      type: number
 *                          vatPercentage:
 *                              type: number
 *                          bankAccounts:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      bankName:
 *                                          type: string
 *                                      accountName:
 *                                          type: string
 *                                      accountNumber:
 *                                          type: string
 *                                      branch:
 *                                          type: string
 *                                      
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CompanySettingsResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function insertSettings(req, res, next) {
    companySettingsService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}
