const { transform } = require('../../../../shared');
const { implementation } = require('../UK/extract');

module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    transform,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation,
};
