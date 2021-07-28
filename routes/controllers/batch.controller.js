const express = require('express');
const router = express.Router();
const batchService = require('services/batch.service');

router.post('/', createBatch);
router.get('/:id', getById);
router.get('/product/:id', getByProductId);
router.get('/code/:code', getByCode);

module.exports = router;

function createBatch(req, res, next){
    batchService.create(req.body)
        .then(batch => res.json(batch))
        .catch(err => next(err))
}

function getById(req, res, next){
    batchService.getById(req.params.id)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}

function getByProductId(req, res, next){
    batchService.getByProductId(req.params.id)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}

function getByCode(req, res, next){
    batchService.getByCode(req.params.code)
        .then(batch => batch ? res.json(batch) : res.sendStatus(404))
        .catch(err => next(err))
}