const express = require('express');
const router = express.Router();
const chequeService = require('services/cheque.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.get('/', getAllCheques);
router.get('/group/customer', groupByCustomerId);
router.post('/', saveCheque);
router.put('/', editCheque);
router.get('/getChequesClearedToday', getActionedToday);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      ChequeResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f004d9da27ba2a7c4b0617
 *              isMiti:
 *                  type: boolean
 *                  example: true
 *              cleared:
 *                  type: boolean
 *                  example: true
 *              clearing:
 *                  type: boolean
 *                  example: false
 *              cash:
 *                  type: boolean
 *                  example: false
 *              customerID:
 *                  type: string
 *                  example: 60f004d9da27ba2a7c4b0617
 *              InvoiceNumber:
 *                  type: string
 *                  example: 123123123
 *              InvoiceId:
 *                  type: string
 *                  example: 60f004d9da27ba2a7c4b0617
 *              amount:
 *                  type: number
 *                  example: 50000
 *              number:
 *                  type: number
 *                  example: 123123123
 *              bankName:
 *                  type: string
 *                  example: test Bank
 *              acName:
 *                  type: string
 *                  example: test acc
 *              date:
 *                  type: string
 *                  example: 2021-07-15
 *              clearedDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              bounce:
 *                  type: array
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              __v:
 *                  type: number
 *                  example: 0
 * 
 *      GetAllChequeResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60f004d9da27ba2a7c4b0617
 *              isMiti:
 *                  type: boolean
 *                  example: true
 *              cleared:
 *                  type: boolean
 *                  example: true
 *              clearing:
 *                  type: boolean
 *                  example: false
 *              cash:
 *                  type: boolean
 *                  example: false
 *              customerID:
 *                  type: string
 *                  example: 60f004d9da27ba2a7c4b0617
 *              InvoiceNumber:
 *                  type: string
 *                  example: 123123123
 *              InvoiceId:
 *                  $ref: '#/components/schemas/InvoiceResponse'
 *              amount:
 *                  type: number
 *                  example: 50000
 *              number:
 *                  type: number
 *                  example: 123123123
 *              bankName:
 *                  type: string
 *                  example: test Bank
 *              acName:
 *                  type: string
 *                  example: test acc
 *              date:
 *                  type: string
 *                  example: 2021-07-15
 *              clearedDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              bounce:
 *                  type: array
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-15T00:00:00.000Z
 *              __v:
 *                  type: number
 *                  example: 0    
 */

/**
 * @swagger
 * /cheque:
 *  get:
 *      description: Find all cheques
 *      summary: Get all cheques
 *      tags:
 *          - Cheque
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
 *                              $ref: '#/components/schemas/GetAllChequeResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllCheques(req, res, next) {
    chequeService.getAllCheques()
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

/**
 * @swagger
 * /cheque/group/customer:
 *  get:
 *      description: Find all cheques grouped by customer id
 *      summary: Group cheques by id
 *      tags:
 *          - Cheque
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
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: 60d7339440a6f01da0064a4b
 *                                  cheques:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/ChequeResponse'
 *                                  count:
 *                                      type: number
 *                                      example: 1
 *                                  Customer:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/PartyResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function groupByCustomerId(req, res, next) {
    chequeService.groupChequesByCustomerID()
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

/**
 * @swagger
 * /cheque:
 *  post:
 *      description: save a cheque
 *      summary: save cheque
 *      tags:
 *          - Cheque
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
 *                          customerID:
 *                              type: string
 *                          InvoiceNumber:
 *                              type: string
 *                          InvoiceId:
 *                              type: string
 *                          amount:
 *                              type: string
 *                          number:
 *                              type: string
 *                          bankName:
 *                              type: string
 *                          acName:
 *                              type: string
 *                          date:
 *                              type: string
 *                          isMiti:
 *                              type: boolean
 *                          cleared:
 *                              type: boolean
 *                          clearedDate:
 *                              type: string
 *                          cash:
 *                              type: boolean
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ChequeResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function saveCheque(req, res, next) {
    chequeService.saveCheque(req.body)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

/**
 * @swagger
 * /cheque:
 *  put:
 *      description: Edit existing cheque
 *      summary: Edit cheque
 *      tags:
 *          - Cheque
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
 *                          cleared:
 *                              type: boolean
 *      responses:
 *          200: 
 *              description: OK
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 *      
 */
function editCheque(req, res, next) {
    chequeService.editCheque(req.body)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

/**
 * @swagger
 * /cheque/getChequesClearedToday:
 *  get:
 *      description: Find cheques cleared today
 *      summary: Cheques cleared today
 *      tags:
 *          - Cheque
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: query
 *          name: status
 *          description: cheque status, value in ["CLEARED","CLEARING"]
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ChequeResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
//Expect params -> status = value in ["CLEARED","CLEARING"]
function getActionedToday(req, res, next) {
    chequeService.getChequesActionedToday(req)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}
