const express = require('express');
const router = express.Router();
const carouselService = require('services/carousel.service');
var fs = require('fs');

// routes
router.get('/',getAll);
router.get('/image/:name',getImage);
router.get('/imageStatic',getImageStatic);
router.post('/',create);

module.exports = router;

function getAll(req, res, next) {
    carouselService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

function create(req, res, next) {
    carouselService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getImageStatic(req, res, next) {
    fs.readFile('_helpers/images/Marvel_Logo_-_Transparent.png', function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data); // Send the file data to the browser.
    });
}
function getImage(req, res, next) {
    fs.readFile('_helpers/images/'+req.params.name, function(err, data) {
        if (err) throw err; // Fail if the file can't be read.
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data); // Send the file data to the browser.
    });
}