// const { transform } = require('../../../../transform');
// const { implementation } = require('../../amazon/shared');
const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazonPrimePantry',
    transform,
    domain: 'amazon.in',
    zipcode: '',
  },
  implementation,
};
