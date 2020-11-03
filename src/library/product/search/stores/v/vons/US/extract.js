const { transform } = require('../../../../shared');

module.exports = {
	implements: 'product/search/extract',
	parameterValues: {
	  country: 'US',
	  store: 'vons',
	  transform: transform,
	  domain: 'vons.com',
	},
implementation: async () => {
	const fetch = require("node-fetch");
	await fetch("https://www.vons.com/abs/pub/xapi/search/products?request-id=3075590757930&url=https://www.vons.com&pageurl=https://www.vons.com&pagename=search&rows=30&start=30&search-type=keyword&storeid=2053&featured=true&search-uid=&q=%2212%20pack%20beer%22&sort=&userid=&featuredsessionid=80db3232-de68-4c6a-bdb2-e1e1d1d5c468&screenwidth=1325", {
		"credentials":"include" ,
		"headers": {
			"Ocp-Apim-Subscription-Key": "e914eec9448c4d5eb672debf5011cf8f",
			},
	    "method": "GET"
		}).then(r => r.json());
}
}