const db = require('../_helpers/db');
const Cheque = db.Cheque;
var moment = require('moment');
const dailyAccountService = require('services/daily_account.service');

module.exports = {
    getAllCheques,
    saveCheque,
    groupChequesByCustomerID,
    editCheque,
    getChequesActionedToday,
};

async function getAllCheques() {
    return await Cheque.find().populate(['InvoiceId']);
}

async function saveCheque(params) {
    console.log(params);
    const cheque = new Cheque(params);
    return await new Promise((resolve, reject) => {
        cheque.save().then(data => {
            resolve(data);
        }).catch(err => reject(err));
    })
}

async function editCheque(params) {
    return await new Promise((resolve, reject) => {
        if (typeof (params) === 'object') {
            updateCheque(params).then(res => resolve(res)).catch(err => reject(err));
        } else {
            reject('Should be object')
        }
    });
}

function removeKeysFromCheque(object) {
    // delete object.InvoiceId;
    delete object._id;
    return object
}

function updateCheque(params) {
    return new Promise((resolve, reject) => {
        let results = {};
        let query = [];
        let cashWithdraw = {
            cashReceived: 0
        };
        if (Array.isArray(params)) {
            const queryBuilder = new Promise(resolveQueryBuilder => {
                const dateTime = Date.now();
                params.forEach((cheque, i, array) => {
                    const thisCheque = new Promise(resolveThisCheque => {
                        Cheque.findOne({_id: cheque.id}).then(val => resolveThisCheque(val))
                    });
                    thisCheque.then(val => {
                        if (!val.cleared) {
                            let json = {
                                updateOne: {
                                    "filter": {_id: cheque.id},
                                    "update": {
                                        $unset: {},
                                        $set: {
                                            cash: cheque.cash,
                                            clearing: cheque.clearing,
                                            cleared: cheque.cleared,
                                        }
                                    }
                                }
                            };
                            if (cheque.cash) {
                                json.updateOne.update.$unset.depositAccount = null;
                            } else {
                                if (cheque.depositAccount?.length < 24) {
                                    reject('Bank account not selected');
                                }
                                json.updateOne.update.$set['depositAccount'] = cheque.depositAccount;
                            }
                            if (cheque.cleared) {
                                json.updateOne.update.$set['clearedDate'] = dateTime;
                            } else {
                                json.updateOne.update.$unset.clearedDate = 1;
                            }
                            if (!cheque.cleared && !cheque.clearing && cheque.newReason?.length > 0) {
                                if (cheque.bounce?.length > 0) {
                                    json.updateOne.update.$set['bounce'] = cheque.bounce;
                                } else {
                                    json.updateOne.update.$set['bounce'] = [];
                                }
                                json.updateOne.update.$set['bounce'].push({
                                    reason: cheque.newReason,
                                    date: dateTime
                                });
                                delete json.updateOne.update.$set.depositAccount;
                                json.updateOne.update.$unset.depositAccount = null;
                            }
                            json.updateOne.update.$set.updatedDate = dateTime;
                            if (Object.keys(json.updateOne.update.$unset).length === 0)
                                delete json.updateOne.update.$unset;
                            query.push(json);
                            if (cheque.cleared && cheque.cash) {
                                cashWithdraw.cashReceived = cashWithdraw.cashReceived + cheque.amount;
                            }
                        }
                        if (i === array.length - 1) resolveQueryBuilder()
                    });
                })
            });
            queryBuilder.then(() => {
                // resolve(query);
                if (query.length > 0) {
                    Cheque.bulkWrite(query).then(res => {
                        if (cashWithdraw.cashReceived > 0)
                            dailyAccountService.update(cashWithdraw).then(cw => {
                                res['cashWithdraw'] = cw;
                                resolve(res);
                            }).catch(err => reject(err));
                        else resolve(res);
                    }).catch(err => reject(err));
                } else resolve();
            })
        } else {
            const filteredCheque = removeKeysFromCheque(params);
            Cheque.findOneAndUpdate(params.id, filteredCheque)
                .then(res => {
                    results[cheque._id] = {res};
                    resolve(results);
                })
                .catch(err => {
                    results[cheque._id] = {err};
                    resolve(results);
                })
        }
    })
}

async function groupChequesByCustomerID() {
    return await Cheque.aggregate([
        {
            '$group': {
                '_id': '$customerID',
                'cheques': {
                    '$push': '$$ROOT'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$lookup': {
                'from': 'parties',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'Customer'
            }
        }
    ])
}

async function getChequesActionedToday(params) {
    console.log(params.query);
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    let dateSelector = '';
    if (params.query.status === 'cleared') dateSelector = 'clearedDate';
    else dateSelector = 'createdDate';
    const dateFilter = {[dateSelector]: {$gte: todayStart, $lte: todayEnd}};

    return await Cheque.aggregate([
        {
            $match: {
                [params.query.status]: true,
            }
        },
        {
            $match: dateFilter
        }
    ])
}
