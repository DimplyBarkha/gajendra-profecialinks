const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform,
    domain: 'costco.com',
    zipcode: '94209',
  },
};
