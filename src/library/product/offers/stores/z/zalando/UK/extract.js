const { transform } = require('../../../../shared');
const { implementation } = require('../shared');
module.exports = {
  implements: 'product/offers/extract',
  parameterValues: {
    country: 'UK',
    store: 'zalando',
    transform,
    domain: 'zalando.co.uk',
    zipcode: '',
  },
  implementation,
};
