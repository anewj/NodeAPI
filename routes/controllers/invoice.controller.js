const express = require('express');
const router = express.Router();
const invoiceService = require('services/invoice.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', saveInvoice);
router.get('/', getAllInvoices);
router.get('/number', getInvoiceNumber);
router.get('/number/:invoiceNumber', getInvoiceByNumber);
router.get('/dump/number/:invoiceNumber', getInvoiceDumpByNumber);
// router.get('/:id', getByUserId);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      InvoiceResponse:
 *          type: object
 *          properties:
 *              partyInformation:
 *                  $ref: '#/components/schemas/PartyResponse'
 *              purchasedItems:
 *                  type: object
 *                  properties:
 *                      items:
 *                          type: array
 *                          items:  
 *                              type: object
 *                              properties:
 *                                  item:
 *                                      type: object
 *                                      properties:
 *                                          _id: 
 *                                              type: string
 *                                              example: 60d5e01f78fb5d24e071ca52
 *                                          code:
 *                                              type: string
 *                                              example: 001
 *                                          name:
 *                                              type: string
 *                                              example: Monitor
 *                                  unit:
 *                                      type: object
 *                                      properties:
 *                                          unit:
 *                                              type: object
 *                                              properties:
 *                                                  name:
 *                                                      type: string
 *                                                      example: BOX
 *                                  _id:
 *                                      type: string
 *                                      example: 60d8a100565f9a2d880ba635
 *                                  rate:
 *                                      type: string
 *                                      example: 22727.27
 *                                  pcs:
 *                                      type: number
 *                                      example: 1
 *                                  amount:
 *                                      type: string
 *                                      example: 22727.27
 *                                  discount:
 *                                      type: string
 *                                      example: 0
 *                                  discountAmount:
 *                                      type: string
 *                                      example: 00.0
 *                                  total: 
 *                                      type: string
 *                                      example: 22727.27
 *                      nTotal:
 *                          type: string
 *                          example: 22727.27
 *                      totalBeforeDiscount:
 *                          type: string
 *                          example: 22727.27
 *                      nDiscount:
 *                          type: string
 *                          example: 0.00
 *                      vat:
 *                          type: string
 *                          example: 2272.73
 *                      discount:
 *                          type: string
 *                          example: 0
 *                      gTotal:
 *                          type: string
 *                          example: 25000.00
 *                      discountPercentage:
 *                          type: string
 *                          example: 0
 *                      discountAmount:
 *                          type: string
 *                          example: 0.00
 *                      totalAfterDiscountAmount:
 *                          type: string
 *                          example: 22727.27
 *              _id:
 *                  type: string
 *                  example: 60d8a100565f9a2d880ba633
 *              date:
 *                  type: string
 *                  example: 2022-04-03T18:30:00.000Z
 *              nepalDate:
 *                  type: string
 *                  example: 2078/12/21
 *              invoiceNumber:
 *                  type: string
 *                  example: 1111000003
 *              invoiceDumpRef:
 *                  type: string
 *                  example: 60d8a100565f9a2d880ba62d
 *              createdDate:
 *                  type: string
 *                  example: 2021-06-26T13:55:09.974Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-26T13:55:09.974Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: autoIncrementID
 * 
 *      InvoiceDumpResponse:
 *          type: object
 *          properties:
 *              partyInformation:
 *                  $ref: '#/components/schemas/PartyResponse'
 *              purchasedItems:
 *                  type: object
 *                  properties:
 *                      items:
 *                          type: array
 *                          items:  
 *                              type: object
 *                              properties:
 *                                  item:
 *                                      type: object
 *                                      properties:
 *                                          _id: 
 *                                              type: string
 *                                              example: 60d5e01f78fb5d24e071ca52
 *                                          code:
 *                                              type: string
 *                                              example: 001
 *                                          name:
 *                                              type: string
 *                                              example: Monitor
 *                                  unit:
 *                                      type: object
 *                                      properties:
 *                                          unit:
 *                                              type: object
 *                                              properties:
 *                                                  name:
 *                                                      type: string
 *                                                      example: BOX
 *                                  _id:
 *                                      type: string
 *                                      example: 60d8a100565f9a2d880ba635
 *                                  rate:
 *                                      type: string
 *                                      example: 22727.27
 *                                  pcs:
 *                                      type: number
 *                                      example: 1
 *                                  amount:
 *                                      type: string
 *                                      example: 22727.27
 *                                  discount:
 *                                      type: string
 *                                      example: 0
 *                                  discountAmount:
 *                                      type: string
 *                                      example: 00.0
 *                                  total: 
 *                                      type: string
 *                                      example: 22727.27
 *                      nTotal:
 *                          type: string
 *                          example: 22727.27
 *                      totalBeforeDiscount:
 *                          type: string
 *                          example: 22727.27
 *                      nDiscount:
 *                          type: string
 *                          example: 0.00
 *                      vat:
 *                          type: string
 *                          example: 2272.73
 *                      discount:
 *                          type: string
 *                          example: 0
 *                      gTotal:
 *                          type: string
 *                          example: 25000.00
 *                      discountPercentage:
 *                          type: string
 *                          example: 0
 *                      discountAmount:
 *                          type: string
 *                          example: 0.00
 *                      totalAfterDiscountAmount:
 *                          type: string
 *                          example: 22727.27
 *              _id:
 *                  type: string
 *                  example: 60d8a100565f9a2d880ba633
 *              date:
 *                  type: string
 *                  example: 2022-04-03T18:30:00.000Z
 *              nepalDate:
 *                  type: string
 *                  example: 2078/12/21
 *              invoiceNumber:
 *                  type: string
 *                  example: 1111000003
 *              invoiceCounter:
 *                  type: number
 *                  example: 3
 *              creditSale:
 *                  type: boolean
 *                  example: false
 *              createdDate:
 *                  type: string
 *                  example: 2021-06-26T13:55:09.974Z
 *              updatedDate:
 *                  type: string
 *                  example: 2021-06-26T13:55:09.974Z
 *              __v:
 *                  type: number
 *                  example: 0
 *              id:
 *                  type: string
 *                  example: autoIncrementID
 */

/**
 * @swagger
 * /invoice:
 *  get:
 *      description: Find all invoices
 *      summary: Get all invoices
 *      tags:
 *          - Invoice
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
 *                              $ref: '#/components/schemas/InvoiceResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getAllInvoices(req, res, next) {
    invoiceService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function saveInvoice(req, res, next) {
    invoiceService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /invoice/number:
 *  get:
 *      description: Find invoice number
 *      summary: Get invoice number
 *      tags:
 *          - Invoice
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
 *                              counter:
 *                                  type: number
 *                                  example: 13
 *                              _id:
 *                                  type: string
 *                                  example: autoIncrementID
 *                              createdDate:
 *                                  type: string
 *                                  example: 2021-06-26T13:55:09.974Z
 *                              updatedDate:
 *                                  type: string
 *                                  example: 2021-06-26T13:55:09.974Z
 *                              __v:
 *                                  type: number
 *                                  example: 0
 *                              id:
 *                                  type: string
 *                                  example: autoIncrementID
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getInvoiceNumber(req, res, next) {
    invoiceService.getInvoiceNumber()
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /invoice/number/{invoiceNumber}:
 *  get:
 *      description: Find invoice by the invoice number
 *      summary: Get invoice by invoice number
 *      tags:
 *          - Invoice
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvoiceResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getInvoiceByNumber(req, res, next) {
    invoiceService.getInvoiceByNumber(req.params.invoiceNumber)
        .then(data => res.json(data))
        .catch(err => next(err));
}

/**
 * @swagger
 * /invoice/dump/number/{invoiceNumber}:
 *  get:
 *      description: Find invoice dump by the invoice number
 *      summary: Get invoice dump by invoice number
 *      tags:
 *          - Invoice
 *      produces:
 *          - application/json
 *      security: []
 *      responses:
 *          200: 
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InvoiceDumpResponse'
 *          403:
 *              description: Access token does not have the required permission
 *          500:
 *              description: Internal Server Error or Custom Error Message
 */
function getInvoiceDumpByNumber(req, res, next) {
    invoiceService.getInvoiceDumpByNumber(req.params.invoiceNumber)
        .then(data => res.json(data))
        .catch(err => next(err));
}
