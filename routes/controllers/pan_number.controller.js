const express = require('express');
const router = express.Router();
const panNumberService = require('services/pan_number.service');

router.get('/:panNumber', getPAN);

module.exports = router;

function getPAN(req, res, next) {
    panNumberService.getPAN(req.params.panNumber)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}
