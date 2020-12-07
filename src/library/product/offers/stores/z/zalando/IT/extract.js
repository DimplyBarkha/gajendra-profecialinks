const { transform } = require('../../../../shared');
const { implementation } = require('../UK/extract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'IT',
    store: 'zalando',
    transform,
    domain: 'zalando.it',
    zipcode: '',
  },
  implementation,
};
