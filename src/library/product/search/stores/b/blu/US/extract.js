const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'blu',
    transform,
    zipcode: '',
    domain: 'blu.com',
  },
};
