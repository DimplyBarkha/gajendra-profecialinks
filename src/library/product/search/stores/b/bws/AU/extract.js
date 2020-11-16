const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'bws',
    transform,
    domain: 'bws.com.au',
    zipcode: "''",
  },
};
