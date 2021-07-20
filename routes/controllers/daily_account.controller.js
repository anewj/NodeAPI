const express = require('express');
const router = express.Router();
const dailyAccountService = require('services/daily_account.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.get('/todaySales', getTodaySales);
router.get('/lastDay', getLastDay);
router.put('/updateCash', saveCashReceived);
router.get('/creditRemaining',creditRemaining);
router.get('/creditRemaining/group',creditSaleByGroup);
router.get('/creditRemaining/:id',creditSaleById);
router.get('/account/:id',getCustomerHistory);
// router.get('/invoiceNumber', getInvoiceNumber);
// router.get('/:id', getByUserId);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      CreditRemainingResponse:
 *          type: object
 *          properties:
 *              partyInformation:
 *                  $ref: '#/components/schemas/PartyResponse'
 *              purchasedItems:
 *                  type: object
 *                  properties:
 *                      payment:
 *                          type: object
 *                          properties:
 *                              chequeDetails:
 *                                  type: object
 *                                  properties:
 *                                      amount:
 *                                          type: string
 *                                          example: 25000
 *                                      number:
 *                                          type: string
 *                                          example: 123123123333123333
 *                                      acHolder:
 *                                          type: string
 *                                          example: prashad
 *                                      bankName:
 *                                          type: string
 *                                          example: test bank
 *                                      date:
 *                                          type: string
 *                                          example: 2078/04/04
 *                                      isMiti:
 *                                          type: boolean
 *                                          example: true
 *                              tenderAmount:
 *                                  type: string
 *                                  example: 25000
 *                              change:
 *                                  type: number
 *                                  example: 0
 *                      items:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  item:
 *                                      type: object
 *                                      properties:
 *                                          vendor:
 *                                              $ref: '#/components/schemas/VendorResponse' 
 *                                          _id:
 *                                              type: string
 *                                              example: 60d5e01f78fb5d24e071ca52 
 *                                          code:
 *                                              type: string
 *                                              example: 001 
 *                                          name:
 *                                              type: string
 *                                              example: Monitor
 *                                          units:
 *                                              type: array
 *                                              items:
 *                                                  type: object
 *                                                  properties:
 *                                                      unit:
 *                                                          $ref: '#/components/schemas/UnitResponse'
 *                                                      _id:
 *                                                          type: string
 *                                                          example: 60d5e01f78fb5d24e071ca53
 *                                                      position:
 *                                                          type: number
 *                                                          example: 0
 *                                                      rate:
 *                                                          type: number
 *                                                          example: 1
 *                                          createdDate: 
 *                                              type: string
 *                                              example: 2021-06-25T13:54:39.628Z
 *                                          updatedDate: 
 *                                              type: string
 *                                              example: 2021-06-25T13:54:39.628Z
 *                                  unit:
 *                                      type: object
 *                                      properties:
 *                                          unit:
 *                                              type: object
 *                                              properties:
 *                                                  name:
 *                                                      type: string
 *                                                      example: BOX
 *                                          _id:
 *                                              type: string
 *                                              example: 60d5e01f78fb5d24e071ca53
 *                                  _id: 
 *                                      type: string
 *                                      example: 60d5e01f78fb5d24e071ca53
 *                                  rate:
 *                                      type: string
 *                                      example: 39823.01
 *                                  pcs:
 *                                      type: number
 *                                      example: 1
 *                                  amount:
 *                                      type: string
 *                                      example: 39823.01
 *                                  discount:
 *                                      type: string
 *                                      example: 0
 *                                  discountAmount:
 *                                      type: string
 *                                      example: 0
 *                                  total:
 *                                      type: string
 *                                      example: 39823.01
 *                                  stockDeduct:
 *                                      type: number
 *                                      example: 1
 *                      nTotal:
 *                          type: string
 *                          example: 39823.01
 *                      totalBeforeDiscount:
 *                          type: string
 *                          example: 39823.01
 *                      nDiscount:
 *                          type: string
 *                          example: 0.00
 *                      vat:
 *                          type: string
 *                          example: 5176.99
 *                      discount:
 *                          type: string
 *                          example: 0
 *                      gTotal:
 *                          type: string
 *                          example: 45000.00
 *                      fTotal:
 *                          type: string
 *                          example: 45000.00
 *                      roundOff:
 *                          type: string
 *                          example: 0
 *                      discountPercentage:
 *                          type: string
 *                          example: 0  
 *                      discountAmount:
 *                          type: string
 *                          example: 0.00
 *                      totalAfterDiscountAmount:
 *                          type: string
 *                          example: 39823.01
 *              _id:
 *                  type: string
 *                  example: 60f5552b184f410eccfa8c9b 
 *              date:
 *                  type: string
 *                  example: 2021-07-19T10:30:37.756Z
 *              nepalDate:
 *                  type: string
 *                  example: 2078/4/4
 *              invoiceNumber:
 *                  type: string
 *                  example: 2222000011
 *              invoiceCounter:
 *                  type: number
 *                  example: 11
 *              creditSale:
 *                  type: boolean   
 *                  example: true
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-19T10:34:19.973Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-19T10:34:19.973Z
 *              __v: 
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60f5552b184f410eccfa8c9b  
 * 
 *      purchasedItems:
 *          type: object
 *          properties:
 *              payment:
 *                      type: object
 *                      properties:
 *                          chequeDetails:
 *                              type: object
 *                              properties:
 *                                  amount:
 *                                      type: string
 *                                      example: 25000
 *                                  number:
 *                                      type: string
 *                                      example: 123123123333123333
 *                                  acHolder:
 *                                      type: string
 *                                      example: prashad
 *                                  bankName:
 *                                      type: string
 *                                      example: test bank
 *                                  date:
 *                                      type: string
 *                                      example: 2078/04/04
 *                                  isMiti:
 *                                      type: boolean
 *                                      example: true
 *                          tenderAmount:
 *                              type: string
 *                              example: 25000
 *                          change:
 *                              type: number
 *                              example: 0
 *              items:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          item:
 *                              type: object
 *                              properties:
 *                                  vendor:
 *                                      $ref: '#/components/schemas/VendorResponse' 
 *                                  _id:
 *                                      type: string
 *                                      example: 60d5e01f78fb5d24e071ca52 
 *                                  code:
 *                                      type: string
 *                                      example: 001 
 *                                  name:
 *                                      type: string
 *                                      example: Monitor
 *                                  units:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              unit:
 *                                                  $ref: '#/components/schemas/UnitResponse'
 *                                              _id:
 *                                                  type: string
 *                                                  example: 60d5e01f78fb5d24e071ca53
 *                                              position:
 *                                                  type: number
 *                                                  example: 0
 *                                              rate:
 *                                                  type: number
 *                                                  example: 1
 *                                  createdDate: 
 *                                      type: string
 *                                      example: 2021-06-25T13:54:39.628Z
 *                                  updatedDate: 
 *                                      type: string
 *                                      example: 2021-06-25T13:54:39.628Z
 *                          unit:
 *                              type: object
 *                              properties:
 *                                  unit:
 *                                      type: object
 *                                      properties:
 *                                          name:
 *                                              type: string
 *                                              example: BOX
 *                                  _id:
 *                                      type: string
 *                                      example: 60d5e01f78fb5d24e071ca53
 *                          _id: 
 *                              type: string
 *                              example: 60d5e01f78fb5d24e071ca53
 *                          rate:
 *                              type: string
 *                              example: 39823.01
 *                          pcs:
 *                              type: number
 *                              example: 1
 *                          amount:
 *                              type: string
 *                              example: 39823.01
 *                          discount:
 *                              type: string
 *                              example: 0
 *                          discountAmount:
 *                              type: string
 *                              example: 0
 *                          total:
 *                              type: string
 *                              example: 39823.01
 *                          stockDeduct:
 *                              type: number
 *                              example: 1
 *              nTotal:
 *                  type: string
 *                  example: 39823.01
 *              totalBeforeDiscount:
 *                  type: string
 *                  example: 39823.01
 *              nDiscount:
 *                  type: string
 *                  example: 0.00
 *              vat:
 *                  type: string
 *                  example: 5176.99
 *              discount:
 *                  type: string
 *                  example: 0
 *              gTotal:
 *                  type: string
 *                  example: 45000.00
 *              fTotal:
 *                  type: string
 *                  example: 45000.00
 *              roundOff:
 *                  type: string
 *                  example: 0 
 *              discountPercentage:
 *                  type: string
 *                  example: 0   
 *              discountAmount:
 *                  type: string
 *                  example: 0.00
 *              totalAfterDiscountAmount:
 *                  type: string
 *                  example: 39823.01
 *      
 *      DailyAccountResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 60efe471654f712f84034f12
 *              updatedDate:
 *                  type: string
 *                  example: 2021-07-15T07:32:01.412Z
 *              createdDate:
 *                  type: string
 *                  example: 2021-07-15T07:32:01.412Z
 *              openingCash:
 *                  type: number
 *                  example: 125000
 *              cashInCounter:
 *                  type: number
 *                  example: 150000
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: 60efe471654f712f84034f12                                         
 */

/**
 * @swagger
 * /dailyAccount/todaySales:
 *  get:
 *      description: Find today's sales
 *      summary: Today sales
 *      tags:
 *          - Daily Account
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
 *                              $ref: '#/components/schemas/CreditRemainingResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getTodaySales(req, res, next) {
    dailyAccountService.getTodaySale()
        .then(sales => res.json(sales))
        .catch(err => next(err));
}

function getInvoiceNumber(req, res, next) {
    invoiceService.getInvoiceNumber()
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/lastDay:
 *  get:
 *      description: Get account of last day
 *      summary: Last day
 *      tags:
 *          - Daily Account
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DailyAccountResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getLastDay(req, res, next) {
    dailyAccountService.getLastDay()
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/updateCash:
 *  put:
 *      description: Update cash on counter
 *      summary: Update cash
 *      tags:
 *        - Daily Account
 *      produces:
 *        - application/json
 *      security: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          cashReceived:
 *                              type: number
 *                      required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DailyAccountResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 *                  
 *        
 */
function saveCashReceived(req, res, next) {
    dailyAccountService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/creditRemaining:
 *  get:
 *      description: Find the remaining credits
 *      summary: Get remaining credits
 *      tags:
 *          - Daily Account
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
 *                              $ref: '#/components/schemas/CreditRemainingResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function creditRemaining(req, res, next) {
    dailyAccountService.creditSale(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/creditRemaining/group:
 *  get:
 *      description: Find remaining credits by group
 *      summary: Get remailing credits by group 
 *      tags:
 *          - Daily Account
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
 *                                      type: object
 *                                      properties:
 *                                          customerID:
 *                                              type: string
 *                                              example: 60ed75cc252d46311ce4a15b
 *                                          name:
 *                                              type: string
 *                                              example: Hari
 *                                          contactNumber:
 *                                              type: array
 *                                              items:
 *                                                  type: object
 *                                                  properties:
 *                                                      _id:
 *                                                          type: string
 *                                                          example: 60ed75cc252d46311ce4a15b
 *                                                      number:
 *                                                          type: number
 *                                                          example: 21341231421
 *                                  count: 
 *                                      type: number
 *                                      example: 1
 *                                  creditNumber:
 *                                      type: object
 *                                      properties:
 *                                          $numberDecimal:
 *                                              type: string
 *                                              example: 50000.00
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function creditSaleByGroup(req, res, next) {
    dailyAccountService.creditSaleByGroup(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/creditRemaining/{id}:
 *  get:
 *      description: Find credit sales by customer id
 *      summary: Get credit sales by id
 *      tags:
 *          - Daily Account
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: customer id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/CreditRemainingResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function creditSaleById(req, res, next) {
    dailyAccountService.creditSaleByCustomerId(req.params.id)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /dailyAccount/account/{id}:
 *  get:
 *      description: Find customer history by customer id
 *      summary: Get customer history
 *      tags:
 *          - Daily Account
 *      produces:
 *          - application/json
 *      security: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: customer id
 *          required: true
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: object
 *                                  properties:
 *                                      customerID:
 *                                          type: string
 *                                          example: 60ed75cc252d46311ce4a15b
 *                                      name:
 *                                          type: string
 *                                          example: Hari
 *                              count:
 *                                  type: number
 *                                  example: 1
 *                              totalPurchasedAmount:
 *                                  type: number
 *                                  example: 150000
 *                              totalAdjustment:
 *                                  type: number
 *                                  example: 0 
 *                              totalPayableAmount:
 *                                  type: number
 *                                  example: 150000
 *                              totalAmountPaid:
 *                                  type: number
 *                                  example: 100000
 *                              creditAmount:
 *                                  type: number
 *                                  example: 50000
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getCustomerHistory(req, res, next) {
    dailyAccountService.getCustomerActivity(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
