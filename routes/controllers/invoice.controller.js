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
function getInvoiceNumber(req, res, next) {
    invoiceService.getInvoiceNumber()
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getInvoiceByNumber(req, res, next) {
    invoiceService.getInvoiceByNumber(req.params.invoiceNumber)
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getInvoiceDumpByNumber(req, res, next) {
    invoiceService.getInvoiceDumpByNumber(req.params.invoiceNumber)
        .then(data => res.json(data))
        .catch(err => next(err));
}
