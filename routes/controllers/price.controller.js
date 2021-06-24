const express = require('express');
const router = express.Router();
const priceService = require('services/price.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertPrice);
router.post('/update', updatePrice);
router.get('/', getAllPrices);
router.get('/:id', getById);
router.put('/bulk', editPrices);

module.exports = router;

function getAllPrices(req, res, next) {
    priceService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

function insertPrice(req, res, next) {
    priceService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function updatePrice(req, res, next) {
    priceService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    priceService.getByProductId(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function editPrices(req, res, next) {
    if (req.body.length > 0) {
        priceService.updateBulk(req.body)
            .then(price => price ? res.json(price) : res.sendStatus(404))
            .catch(err => next(err));
    } else {
        res.status(400)
        res.json({
            "message": "EXPECTS A JSON ARRAY",
            "code": 400,
            "reuiredFormat": [{
                "productCode": "STRING",
                "price": "NUMBER",
                "unitName": "STRING"
            }],
            "example": [
                {
                    "productCode": "abc123",
                    "price": 100,
                    "unitName": "xyz123"
                },
                {
                    "productCode": "def456",
                    "price": 200,
                    "unitName": "test unit"
                }
            ]
        })
    }


}
