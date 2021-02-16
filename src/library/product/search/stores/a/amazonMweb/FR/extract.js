const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.fr',
    zipcode: '',
  },
  implementation,
};
