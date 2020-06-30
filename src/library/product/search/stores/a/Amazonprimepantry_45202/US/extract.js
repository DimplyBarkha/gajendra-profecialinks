const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'Amazonprimepantry_45202',
    transform,
    domain: 'amazon.com',
    zipcode: '45202',
  },
};
