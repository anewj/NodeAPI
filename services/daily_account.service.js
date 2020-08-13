const db = require('../_helpers/db');
const DailyAccount = db.DailyAccount;
const InvoiceDump = db.InvoiceDump;
var moment = require('moment');

module.exports = {
    create,
    getTodaySale,
    // getInvoiceNumber,
    getLastDay
};

// async function create(params) {
//     const dateToday = moment().startOf('day').valueOf();
//     return await new Promise((resolve, reject) => {
//         DailyAccount.findOneAndUpdate({'createdDate': dateToday}, {
//             $inc: {
//                 cashInCounter: params.cashInCounter,
//                 openingCash: params.openingCash
//             }
//         }).then(res => {
//                 if (res)
//                     resolve(res);
//                 else {
//                     const yesterday = moment().subtract(1, 'day').startOf('day').valueOf();
//                     DailyAccount.findOne({'createdDate': yesterday}).then(yesterday => {
//                         console.log('yesterday ' + yesterday);
//                         if (yesterday) {
//                             params.openingCash = parseFloat(params.cashInCounter) + parseFloat(yesterday.cashInCounter)
//                         }
//                         params.updatedDate = new Date();
//                         params.createdDate = dateToday;
//                         const dailyAccount = new DailyAccount(params);
//                         dailyAccount.save().then(val => resolve(val)).catch(err => {
//                                 console.log('dailyAccount : save error' + err);
//                                 reject(err)
//                                 // if (err.keyPattern.hasOwnProperty('createdDate') &&
//                                 //     new Date(err.keyValue.createdDate).toLocaleString() === new Date(dateOnlyToday).toLocaleString()) {
//                                 //     reject(err)
//                                 // }
//                             }
//                         );
//                     }).catch(yesterdayError => reject(yesterdayError));
//                 }
//             }
//         ).catch(err => {
//             console.log('dailyAccount : findOneAndUpdate error' + err);
//             reject(err)
//         });
//     })
// }

async function create(params) {
    const dateToday = moment().startOf('day').valueOf();

    return await new Promise((resolve, reject) => {
        DailyAccount.findOneAndUpdate({'createdDate': dateToday}, {
            $inc: {
                cashInCounter: params.cashInCounter,
                openingCash: params.openingCash
            }
        }).then(res => {
                if (res)
                    resolve(res);
                else {
                    DailyAccount.find().sort({ $natural: -1 }).limit(1).then(lastDay => {
                        console.log('lastDay ' + lastDay[0]);
                        const lastDayRec = lastDay[0];
                        if (lastDay.length === 1) {
                            params.openingCash = parseFloat(params.cashInCounter) + parseFloat(lastDayRec.cashInCounter)
                        }
                        params.updatedDate = new Date();
                        params.createdDate = dateToday;
                        const dailyAccount = new DailyAccount(params);
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
    const yesterdayStart = moment().subtract(1,'day').startOf('day').toDate();
    const yesterdayEnd = moment().subtract(1,'day').endOf('day').toDate();
    const tomorrowStart = moment().add(1,'day').startOf('day').toDate();
    const tomorrowEnd = moment().add(1,'day').endOf('day').toDate();
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
    return await DailyAccount.find().sort({ $natural: -1 }).limit(1);

    // return await Invoice.find().sort([['date', -1]]);
}

// async function getInvoiceNumber() {
//     return await InvoiceNumber.findById(config.autoIncrementID);
// }
