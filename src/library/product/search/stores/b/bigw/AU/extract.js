const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    transform,
    domain: 'bigw.com.au',
    zipcode: "''",
  },
};
