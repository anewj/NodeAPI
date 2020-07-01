const db = require('../_helpers/db');
const CompanySettings = db.CompanySettings;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
};

async function create(settingsParams) {
    // const companySettings = await CompanySettings.ge({user_id: settingsParams.user_id});
    return await new Promise((resolve, reject) =>
        CompanySettings.count({}, function (err, count) {
            console.log("Number of docs: ", count);
            console.log("settingsParams: ", Object.keys(settingsParams).length);
            if (Object.keys(settingsParams).length !== 0) {
                if (count === 0) {
                    // save Company Settings
                    settingsParams._id = new mongoose.Types.ObjectId();
                    const settings = new CompanySettings(settingsParams);
                    settings.save().then(settings => {
                            resolve(settings);
                        }
                    ).catch(err => {
                        console.log(err);
                        reject(err);
                    })
                } else {
                    CompanySettings.find().then(arr => {
                        CompanySettings.findOneAndUpdate({_id: arr[0]._id}, settingsParams).then(result => resolve(result)).catch(err => reject(err));
                    }).catch(err => {
                        reject(err);
                    })
                }
            } else {
                reject('Please provide post parameters.')
            }
        })
    )
}

async function getAll() {
    return await CompanySettings.find();
}
