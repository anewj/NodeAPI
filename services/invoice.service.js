const db = require('../_helpers/db');
const config = require('../config/config');
const Invoice = db.Invoice;
const InvoiceNumber = db.InvoiceNumber;
const InvoiceDump = db.InvoiceDump;
const Counter = require('../db/models/tax_invoice_counter.model');
const Stock = require('../db/models/stock.model');
const SalesDetail = db.SalesDetail;
const DailyAccount = db.DailyAccount;
const dailyAccountService = require('./daily_account.service');
module.exports = {
    create,
    getAll,
    getInvoiceNumber,
    getInvoiceByNumber,
    getInvoiceDumpByNumber
};

async function create(invoiceParams) {
    const invoiceDump = new InvoiceDump(invoiceParams);
    return await new Promise((resolve, reject) => {
        invoiceDump.save().then(result => {
                invoiceParams.invoiceDumpRef = result._id;
                const invoice = new Invoice(invoiceParams);
                invoice.save().then(finalResult => {
                    let stockUpdateCounter = 0;
                    invoiceParams.purchasedItems.items.forEach((item, index, array) => {
                        Stock.findOneAndUpdate(
                            {"product_id": item.item._id},
                            {$inc: {availableQuantity: -item.stockDeduct}})
                            .then(res => {
                                stockUpdateCounter++
                            })
                            .catch(err => reject(err)
                            );
                        if (Object.is(array.length - 1, index)) {
                            let saleDetailJson = invoiceParams.purchasedItems;
                            saleDetailJson.invoiceDumpRef = result._id;
                            const salesDetail = new SalesDetail(saleDetailJson);
                            salesDetail.save().then(detail => {
                                let dailyAccountPostJson = {
                                    cashInCounter: parseFloat(invoiceParams.purchasedItems.payment.tenderAmount).toFixed(2) -
                                        parseFloat(invoiceParams.purchasedItems.payment.change).toFixed(2)
                                };
                                // const dailyAccount = new DailyAccount(dailyAccountPostJson);
                                // dailyAccountService.create(dailyAccountPostJson).then(dailyAccVal => {
                                //     let respJson = {};
                                //     respJson.invoice = finalResult;
                                //     respJson.saleDetail =detail;
                                //     respJson.dailyAccount = dailyAccVal;
                                //     resolve(respJson);
                                // }).catch(dailyAccErr => {
                                //     reject (dailyAccErr);
                                // })

                                let respJson = {};
                                    respJson.invoice = finalResult;
                                    respJson.saleDetail = detail;
                                    resolve(respJson);
                            }).catch(saleDetailErr => {
                                reject (saleDetailErr);
                            })
                        }
                    })
                }).catch(finalError => reject(finalError))
            }
        ).catch(err => {
            /**
             * Deduct invoice counter which was increased by pre function
             */
            Counter.findOneAndUpdate({_id: config.autoIncrementID}, {$inc: {counter: -1}}, function (error, counter) {
                if (error) {
                    reject(error);
                }
                reject(err)
            })
        });
    });
}

async function getAll() {
    return await Invoice.find().sort([['date', -1]]);
}

async function getInvoiceNumber() {
    return await InvoiceNumber.findById(config.autoIncrementID);
}

async function getInvoiceByNumber(invoiceNumber) {
    return await Invoice.findOne({invoiceNumber: invoiceNumber})
}

async function getInvoiceDumpByNumber(invoiceNumber) {
    return await InvoiceDump.findOne({invoiceNumber: invoiceNumber})
}
