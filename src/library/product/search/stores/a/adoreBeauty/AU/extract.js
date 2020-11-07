const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adoreBeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: "''",
  },
};
