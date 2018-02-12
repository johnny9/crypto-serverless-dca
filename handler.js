'use strict';

const aws = require('aws-sdk');
const sns = new aws.SNS({
    'region': process.env.AWS_DEFAULT_REGION
})
const Gdax = require('gdax');
const sandboxApiUrl = 'https://api-public.sandbox.gdax.com';
const purchasePrice = process.env.INVESTMENT_AMOUNT;
const productId = process.env.PRODUCT_ID || 'BTC-USD';

var authorizedClient;
if (process.env.TEST) {
    console.log('Using sandbox url')
    authorizedClient = new Gdax.AuthenticatedClient(process.env.GDAX_KEY,
        process.env.GDAX_SECRET,
        process.env.GDAX_PASSPHRASE,
        sandboxApiUrl);
} else {
    authorizedClient = new Gdax.AuthenticatedClient(process.env.GDAX_KEY,
        process.env.GDAX_SECRET,
        process.env.GDAX_PASSPHRASE);
}

function getPendingDeposits(accountId) {
    return new Promise(function(resolve, reject) {
        var pendingDeposits = 0;
        authorizedClient.get(['accounts', accountId, 'transfers'])
        .then(transfers => {
            for(var i=0; i<transfers.length; i++) {
                if (transfers[i]['completed_at'] == null) {
                    pendingDeposits += parseFloat(transfers[i]['amount']);
                }
            }
            resolve(pendingDeposits);
        })
        .catch(err => {
            reject(err);
        });
    })
}

function getTotalUsdBalace() {
    return new Promise(function(resolve, reject) {
        authorizedClient.getAccounts()
        .then(accounts => {
            for(var i=0; i<accounts.length; i++) {
                if (accounts[i]['currency'] == 'USD') {
                    var balance = parseFloat(accounts[i]['balance']);

                    getPendingDeposits(accounts[i]['id'])
                    .then(pending => {
                        resolve(balance+pending);
                    }).catch(err => {
                        reject(err)
                    })
                }
            }
        }).catch(err => {
            reject(err)
        });
    });
}


module.exports.start = (event, context, callback) => {
    if (process.env.MINIMUM_BALANCE && process.env.PHONE_NUMBER) {
        getTotalUsdBalace()
        .then(balance => {
            if (balance < process.env.MINIMUM_BALANCE) {
                console.log('Balance is less than ' + process.env.MINIMUM_BALANCE)
                var publishParams = {
                    PhoneNumber : process.env.PHONE_NUMBER,
                    Message: 'Gdax balance is low, $' + Math.round(balance)
                };
                sns.publish(publishParams);
            }
        });
    }

    authorizedClient.buy({
        "funds": purchasePrice,
        "type": "market",
        "side": "buy",
        "product_id": productId
    }).then(data => {
        console.log('Purchased ' + productId + ' for ' + purchasePrice);
    }).catch(error => {
        console.log(error);
    });
};
