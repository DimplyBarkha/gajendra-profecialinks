const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    transform,
    zipcode: '',
    domain: 'blu.com',
  },
};
