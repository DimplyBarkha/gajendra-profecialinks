const { transform } = require('../../../../shared');
const { implementation } = require('../UK/extract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'CH',
    store: 'zalando',
    transform,
    domain: 'zalando.ch',
    zipcode: '',
  },
  implementation,
};
