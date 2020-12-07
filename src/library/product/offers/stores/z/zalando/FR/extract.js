const { transform } = require('../../../../shared');
const { implementation } = require('../UK/extract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'FR',
    store: 'zalando',
    transform,
    domain: 'zalando.fr',
    zipcode: '',
  },
  implementation,
};
