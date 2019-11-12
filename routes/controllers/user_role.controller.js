const express = require('express');
const router = express.Router();
const user_roleService = require('services/user_role.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertUserRole);
router.get('/', getAllUserRoles);
router.get('/:id', getById);
router.get('/code/:code', getByCode);

module.exports = router;

function getAllUserRoles(req, res, next) {
    user_roleService.getAll()
        .then(user_role => res.json(user_role))
        .catch(err => next(err));
}

function insertUserRole(req, res, next) {
    user_roleService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    user_roleService.getById(req.params.id)
        .then(user_role => user_role ? res.json(user_role) : res.sendStatus(404))
        .catch(err => next(err));
}
function getByCode(req, res, next) {
    user_roleService.get(req.params.id)
        .then(user_role => user_role ? res.json(user_role) : res.sendStatus(404))
        .catch(err => next(err));
}
