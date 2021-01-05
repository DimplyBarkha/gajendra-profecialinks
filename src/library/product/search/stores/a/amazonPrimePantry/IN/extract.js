const { transform } = require('../../../../transform');
const { implementation } = require('../../amazon/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazonPrimePantry',
    transform: transform,
    domain: 'amazon.in',
    zipcode: '',
  },
  implementation,
};
