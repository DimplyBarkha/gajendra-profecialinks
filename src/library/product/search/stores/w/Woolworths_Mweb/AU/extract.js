const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'Woolworths_Mweb',
    transform: transform,
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};
