const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsDetails',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
};
