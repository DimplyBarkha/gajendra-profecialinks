const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    transform,
    domain: 'amazon.com.au',
    zipcode: "''",
  },
};
