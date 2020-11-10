const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'clicks',
    transform,
    domain: 'clicks.co.za',
    zipcode: "''",
  },
};
