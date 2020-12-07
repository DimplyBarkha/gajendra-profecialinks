const { transform } = require('../../amazon/sharedTransform');
const { implementation } = require('../../amazon/shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.de',
    zipcode: '',
  },
  implementation,
};
