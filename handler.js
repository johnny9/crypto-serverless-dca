'use strict';

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



module.exports.start = (event, context, callback) => {
  authorizedClient.buy({
    "funds": purchasePrice,
    "type": "market",
    "side": "buy",
    "product_id": productId
    }).then(data => {
    	console.log('Purchased ' + productId + ' for ' + purchasePrice);
    }).catch(error => {
    	console.log(error);
    })
};
