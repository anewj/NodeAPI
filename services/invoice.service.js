const db = require('../_helpers/db');
const config = require('../config/config');
const Invoice = db.Invoice;
const InvoiceNumber = db.InvoiceNumber;
const InvoiceDump = db.InvoiceDump;
const Counter = require('../db/models/tax_invoice_counter.model');
const Stock = require('../db/models/stock.model');
const SalesDetail = db.SalesDetail;
const DailyAccount = db.DailyAccount;
const Cheque = db.Cheque;
const dailyAccountService = require('./daily_account.service');
const chequeService = require('./cheque.service');
module.exports = {
    create,
    getAll,
    getInvoiceNumber,
    getInvoiceByNumber,
    getInvoiceDumpByNumber
};

/**
 * Saves invoice dump > saves invoice > Updates Stock >Saves Sales Details > Saves Cheque if there is one > Increase Cash in counter
 * If invoice dump save fails, deduct the invoice number.
 * @param invoiceParams - Invoice details json
 * @returns {Promise<unknown>} json data containing all the outputs and errors
 */
async function create(invoiceParams) {
    const invoiceDump = new InvoiceDump(invoiceParams);
    const valid = invoiceParams.creditSale ? !!invoiceParams.partyInformation?._id : true;
    return await new Promise((resolve, reject) => {
        if (valid) {
            /**
             * Save Invoice Dump
             */
            invoiceDump.save().then(result => {
                    invoiceParams.invoiceDumpRef = result._id;
                    const invoice = new Invoice(invoiceParams);

                    /**
                     * Save Invoice
                     */
                    invoice.save().then(finalResult => {
                        let stockUpdateCounter = 0;
                        invoiceParams.purchasedItems.items.forEach((item, index, array) => {
                            /**
                             * Update Stock
                             */
                            Stock.findOneAndUpdate(
                                {"product_id": item.item._id},
                                {$inc: {availableQuantity: -item.stockDeduct}})
                                .then(res => {
                                    console.log("stock update success");
                                })
                                .catch(err => {
                                        console.log("stock update fail");
                                        reject(err)
                                    }
                                );

                            if (Object.is(array.length - 1, index)) {
                                try {
                                    let salesDetail = new SalesDetail();
                                    salesDetail.invoiceDumpRef = result._id;
                                    salesDetail.invoiceNumber = result.invoiceNumber;
                                    salesDetail.payment = result.purchasedItems.payment;
                                    /**
                                     * Save SalesDetail
                                     */
                                    salesDetail.save().then(detail => {
                                        try {
                                            let cashReceivedJson = {
                                                cashReceived: Number(invoiceParams.purchasedItems.payment.tenderAmount) -
                                                    Number(invoiceParams.purchasedItems.payment.change)
                                            };
                                            let respJson = {};
                                            respJson.invoice = finalResult;
                                            respJson.saleDetail = detail;

                                            let chequeCheck = new Promise((resolve1, reject1) => {
                                                if (Number(invoiceParams.purchasedItems?.payment?.chequeDetail?.amount) > 0) {
                                                    chequeParams = {
                                                        customerID: invoiceParams.partyInformation._id,
                                                        InvoiceNumber: invoiceParams.invoiceNumber,
                                                        InvoiceId: invoiceParams.invoiceDumpRef.toString(),
                                                        amount: invoiceParams.purchasedItems.payment.chequeDetail.amount,
                                                        number: invoiceParams.purchasedItems.payment.chequeDetail.number,
                                                        acName: invoiceParams.purchasedItems.payment.chequeDetail.acHolder,
                                                        bankName: invoiceParams.purchasedItems.payment.chequeDetail.bankName,
                                                        date: invoiceParams.purchasedItems.payment.chequeDetail.date
                                                    };
                                                    /** Cheque Not required.
                                                     * Save cheque
                                                     */
                                                    chequeService.saveCheque(chequeParams).then(chequeSuccess => {
                                                        respJson.chequeSave = chequeSuccess;
                                                        resolve1(respJson)
                                                    }).catch(err => {
                                                        respJson.chequeSave = err;
                                                        reject1(respJson);
                                                    });
                                                } else {
                                                    respJson.chequeSave = null;
                                                    resolve1(respJson);
                                                }
                                            });

                                            /**
                                             * After check
                                             */
                                            chequeCheck.then(resp => {
                                                /**
                                                 * Increase cash received
                                                 */
                                                dailyAccountService.update(cashReceivedJson).then(cashReceivedSuccess => {
                                                    resp.cashReceived = cashReceivedSuccess;
                                                    resolve(respJson);
                                                }).catch(err => reject(respJson))
                                            }).catch(err => reject(err))
                                        } catch (e) {
                                            console.log('inside save detail save')
                                            console.log(e)
                                        }

                                    }).catch(saleDetailErr => {
                                        console.log('sale detail save fail' + saleDetailErr);
                                        reject(saleDetailErr)
                                    })
                                } catch (e) {
                                    console.log(e)
                                    console.log(result)
                                }
                            }
                        })
                    }).catch(finalError => reject(finalError))
                }
            ).catch(err => {
                /**
                 * Deduct invoice counter which was increased by pre function
                 */
                Counter.findOneAndUpdate({_id: config.autoIncrementID}, {$inc: {counter: -1}}, function (error, counter) {
                    if (error) reject(error);
                    reject(err);
                })
            });
        } else {
            reject('Customer name must be specified when sale is credit.');
        }
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
