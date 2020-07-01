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

function getAllSettings(req, res, next) {
    companySettingsService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertSettings(req, res, next) {
    companySettingsService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}
