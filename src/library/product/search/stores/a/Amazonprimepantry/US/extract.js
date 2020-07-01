const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'Amazonprimepantry',
    transform,
    domain: 'amazon.com',
    zipcode: '10001',
  },
};
