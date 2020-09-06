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
function getLastDay(req, res, next) {
    dailyAccountService.getLastDay()
        .then(data => res.json(data))
        .catch(err => next(err));
}
function saveCashReceived(req, res, next) {
    dailyAccountService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function creditRemaining(req, res, next) {
    dailyAccountService.creditSale(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function creditSaleByGroup(req, res, next) {
    dailyAccountService.creditSaleByGroup(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function creditSaleById(req, res, next) {
    dailyAccountService.creditSaleByCustomerId(req.params.id)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getCustomerHistory(req, res, next) {
    dailyAccountService.getCustomerActivity(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}
