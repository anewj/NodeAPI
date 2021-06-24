var unirest = require('unirest');

module.exports = {
    getPAN
};

async function getPAN(panNumber) {
    const req = new Promise((resolve, reject) => {
        unirest('GET', `https://ird.gov.np/statstics/getPanSearch?pan=${panNumber}`)
            .end(function (res) {
                if (res.error) reject (res.error);
                resolve (res.body);
            });
    });

    return await req;
}
