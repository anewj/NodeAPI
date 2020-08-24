const db = require('../_helpers/db');
const Cheque = db.Cheque;
var moment = require('moment');

module.exports = {
    getAllCheques,
    saveCheque
};

async function getAllCheques() {
    return await Cheque.find().populate(['InvoiceId']);
}

async function saveCheque(params) {
    console.log(params);
    const cheque = new Cheque(params);
    return await new Promise((resolve, reject) => {
        cheque.save().then(data => {
            resolve (data);
        }).catch(err => reject(err));
    })
}
