const db = require('../_helpers/db');
const DailyAccount = db.DailyAccount;
const InvoiceDump = db.InvoiceDump;
var moment = require('moment');
const mongoose = require('mongoose');

const {
    Decimal128
} = require('mongodb');

module.exports = {
    update,
    getTodaySale,
    // getInvoiceNumber,
    getLastDay,
    creditSale,
    creditSaleByGroup,
    creditSaleByCustomerId,
    getCustomerActivity
};

async function update(params) {
    const dateToday = moment().startOf('day').valueOf();
    return await new Promise((resolve, reject) => {
        DailyAccount.findOneAndUpdate({'createdDate': dateToday}, {
            $inc: {
                cashInCounter: params.cashReceived
            }
        }, {new: true}).then(res => {
                if (res) {
                    console.log(res);
                    resolve(res);
                } else {
                    DailyAccount.findOne().sort({$natural: -1}).limit(1).then(lastDay => {
                        let lastDayRec = {};
                        if (lastDay)
                            lastDayRec = lastDay;
                        const dailyAccount = new DailyAccount();
                        dailyAccount.updatedDate = moment();
                        dailyAccount.createdDate = dateToday;
                        dailyAccount.openingCash = Number(lastDayRec?.cashInCounter ? lastDayRec.cashInCounter : 0);
                        dailyAccount.cashInCounter = Number(params.cashReceived) + Number(lastDayRec?.cashInCounter ? lastDayRec.cashInCounter : 0);
                        dailyAccount.save().then(val => resolve(val)).catch(err => {
                                console.log('dailyAccount : save error' + err);
                                reject(err)
                            }
                        );
                    }).catch(lastDayErr => reject(lastDayErr));

                    // const yesterday = moment().subtract(1, 'day').startOf('day').valueOf();
                    // DailyAccount.findOne({'createdDate': yesterday}).then(yesterday => {
                    //     console.log('yesterday ' + yesterday);
                    //     if (yesterday) {
                    //         params.openingCash = parseFloat(params.cashInCounter) + parseFloat(yesterday.cashInCounter)
                    //     }
                    //     params.updatedDate = new Date();
                    //     params.createdDate = dateToday;
                    //     const dailyAccount = new DailyAccount(params);
                    //     dailyAccount.save().then(val => resolve(val)).catch(err => {
                    //             console.log('dailyAccount : save error' + err);
                    //             reject(err)
                    //         }
                    //     );
                    // }).catch(yesterdayError => reject(yesterdayError));
                }
            }
        ).catch(err => {
            console.log('dailyAccount : findOneAndUpdate error' + err);
            reject(err)
        });
    })
}

async function getTodaySale() {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    const yesterdayStart = moment().subtract(1, 'day').startOf('day').toDate();
    const yesterdayEnd = moment().subtract(1, 'day').endOf('day').toDate();
    const tomorrowStart = moment().add(1, 'day').startOf('day').toDate();
    const tomorrowEnd = moment().add(1, 'day').endOf('day').toDate();
    console.log(todayStart);
    console.log(todayEnd);
    const dateFilter = {createdDate: {$gte: todayStart, $lte: todayEnd}};
    const now = {createdDate: {$lte: moment().toDate()}};
    let result = await InvoiceDump.aggregate([
        {$match: dateFilter},
        // {
        //     // $group: {
        //     //     // _id: {day: {$dayOfYear: "$createdDate"}, year: {$year: "$createdDate"}},
        //     //     _id: "$nepalDate",
        //     //     tenderAmountSum: {$sum: {$toDouble: "$purchasedItems.payment.tenderAmount"}},
        //     //     changeSum: {$sum: {$toDouble: "$purchasedItems.payment.change"}},
        //     //     totalSum: {$sum: {$subtract: [{$toDouble: "$purchasedItems.payment.tenderAmount"}, {$toDouble: "$purchasedItems.payment.change"}]}}
        //     // }
        //     $group: {
        //         _id: "$nepalDate",
        //         cashPaid: {$sum: {$subtract: [{$toDouble: "$purchasedItems.payment.tenderAmount"},{$toDouble: "$purchasedItems.payment.change"}]}},
        //     }
        // }
    ]);
    return result;
    // return await InvoiceDump.find(now)
}

async function getLastDay() {
    return await DailyAccount.findOne().sort({$natural: -1}).limit(1);

    // return await Invoice.find().sort([['date', -1]]);
}

// async function getInvoiceNumber() {
//     return await InvoiceNumber.findById(config.autoIncrementID);
// }

async function creditSale(params) {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    return await InvoiceDump.find({creditSale: true})
}

async function creditSaleByGroup() {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    return InvoiceDump.aggregate([
        {
            '$match': {
                'creditSale': true
            }
        }, {
            '$set': {
                'purchasedItems.payment.tenderAmount': {
                    '$convert': {
                        'input': '$purchasedItems.payment.tenderAmount',
                        'to': 'decimal',
                        'onError': Decimal128.fromString('0'),
                        'onNull': Decimal128.fromString('0')
                    }
                },
                'purchasedItems.fTotal': {
                    '$toDecimal': '$purchasedItems.fTotal'
                },
                'purchasedItems.payment.chequeDetail.amount': {
                    '$convert': {
                        'input': '$purchasedItems.payment.chequeDetail.amount',
                        'to': 'decimal',
                        'onError': Decimal128.fromString('0'),
                        'onNull': Decimal128.fromString('0')
                    }
                }
            }
        }, {
            '$group': {
                '_id': {
                    'customerID': '$partyInformation._id',
                    'name': '$partyInformation.name',
                    'contactNumber': '$partyInformation.contactNumber'
                },
                'count': {
                    '$sum': 1
                },
                'creditAmount': {
                    '$sum': {
                        '$subtract': [
                            '$purchasedItems.fTotal', {
                                '$add': [
                                    '$purchasedItems.payment.chequeDetail.amount', '$purchasedItems.payment.tenderAmount'
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]);
}

async function creditSaleByCustomerId(id) {
    return await InvoiceDump.find({creditSale: true, 'partyInformation._id': id})
}

async function getCustomerActivity(req) {
    try {
        let customerID = mongoose.Types.ObjectId(req.params.id);
        let queries = [
            {
                '$match': {
                    'partyInformation._id': customerID
                }
            }, {
                '$set': {
                    'purchasedItems.payment.tenderAmount': nullToZero('$purchasedItems.payment.tenderAmount'),
                    'purchasedItems.fTotal': {
                        '$toDecimal': '$purchasedItems.fTotal'
                    },
                    'purchasedItems.gTotal': {
                        '$toDecimal': '$purchasedItems.gTotal'
                    },
                    'purchasedItems.roundOff': nullToZero('$purchasedItems.roundOff'),
                    'purchasedItems.payment.chequeDetail.amount': nullToZero('$purchasedItems.payment.chequeDetail.amount'),
                }
            }, {
                '$group': {
                    '_id': {
                        'customerID': '$partyInformation._id',
                        'name': '$partyInformation.name'
                    },
                    'count': {
                        '$sum': 1
                    },
                    'totalPurchasedAmount': {
                        '$sum': '$purchasedItems.gTotal'
                    },
                    'totalAdjustment': {
                        '$sum': '$purchasedItems.roundOff'
                    },
                    'totalPayableAmount': {
                        '$sum': '$purchasedItems.fTotal'
                    },
                    'totalAmountPaid': {
                        '$sum': totalAmountPaid()
                    },
                    'creditAmount': {
                        '$sum': {
                            '$subtract': [
                                '$purchasedItems.fTotal',
                                totalAmountPaid()
                            ]
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'invoicedumps',
                    'localField': '_id.customerID',
                    'foreignField': 'partyInformation._id',
                    'as': 'invoices'
                }
            }
        ];
        if (req.query?.lookupInvoices?.toLowerCase() !== 'true') {
            queries.splice(3, 1);
        }
        return await InvoiceDump.aggregate(queries).then(data => {
            const rec = data.map(info => {
               info.totalPurchasedAmount = parseFloat(info.totalPurchasedAmount);
               info.totalAdjustment = parseFloat(info.totalAdjustment);
               info.totalPayableAmount = parseFloat(info.totalPayableAmount);
               info.totalAmountPaid = parseFloat(info.totalAmountPaid);
               info.creditAmount = parseFloat(info.creditAmount);
               return info;
            });
            return rec[0];
        });
    } catch (e) {
        console.log(e)
    }

}

const decimal2JSON = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128')
            prev[i] = v.toString();
        else
            Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v));
    }
};

function nullToZero(field) {
    return {
        '$convert': {
            'input': field,
            'to': 'decimal',
            'onError': Decimal128.fromString('0'),
            'onNull': Decimal128.fromString('0')
        }
    }
}

function totalAmountPaid() {
    return {
        '$add': [
            '$purchasedItems.payment.chequeDetail.amount', {
                '$subtract': [
                    '$purchasedItems.payment.tenderAmount', '$purchasedItems.payment.change'
                ]
            }
        ]
    }
}
