const express = require('express');
const router = express.Router();
const manufacturerService = require('services/manufacturer.service');
var fs = require('fs');
const csv = require('csv-parser');
const partyService = require('services/party.service');

// routes
router.get('/customers', load);
router.post('/customers', loadCustomer);

module.exports = router;

function load(req, res, next) {
    const fileLocation = req.query.fileLocation
    let readStream = fs.createReadStream(fileLocation);
    let dataArray = [];
    readStream.pipe(csv())
        .on('data', (row) => {
            // let number_arr = row.number.replace(/\s/g, '').split(',');
            let number_json = [];
            // for (let i = 0; i < number_arr.length; i++) {
                number_json.push({'number': row.phone});
            // }
            row.contactNumber = number_json;
            dataArray.push(row);
        });

    readStream.on('end', (s) => {
        console.log('CSV file successfully processed');
        partyService.bulkSave(dataArray)
            .then(parties => res.json(parties))
            .catch(err => next(err));

    });

    readStream
        .on('error', (err) => {
            if (err.code === 'ENOENT') {
                res.status(404).send({error: fileLocation})
            }
        })
}

function loadCustomer(req, res, next) {
    partyService.bulkSave(req.body)
        .then(parties => res.json(parties))
        .catch(err => next(err));
}
