const { transform } = require('../../../../shared');
const { implementation } = require('../UK/extract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'BE',
    store: 'zalando',
    transform,
    domain: 'zalando.be',
    zipcode: '',
  },
  implementation,
};
