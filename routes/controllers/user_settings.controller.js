const express = require('express');
const router = express.Router();
const userSettingsService = require('services/user_settings.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertSettings);
router.get('/', getAllSettings);
router.get('/:id', getByUserId);

module.exports = router;

function getAllSettings(req, res, next) {
    userSettingsService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertSettings(req, res, next) {
    userSettingsService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    userSettingsService.getByUserId(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}
