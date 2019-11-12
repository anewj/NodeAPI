const express = require('express');
const router = express.Router();
const roleService = require('services/role.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertRole);
router.get('/', getAllRoles);
router.get('/:id', getById);
router.get('/code/:code', getByCode);

module.exports = router;

function getAllRoles(req, res, next) {
    roleService.getAll()
        .then(role => res.json(role))
        .catch(err => next(err));
}

function insertRole(req, res, next) {
    roleService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    roleService.getById(req.params.id)
        .then(role => role ? res.json(role) : res.sendStatus(404))
        .catch(err => next(err));
}
function getByCode(req, res, next) {
    roleService.getByCode(req.params.code)
        .then(role => role ? res.json(role) : res.sendStatus(404))
        .catch(err => next(err));
}
