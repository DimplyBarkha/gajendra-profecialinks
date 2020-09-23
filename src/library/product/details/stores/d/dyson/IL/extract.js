const { implementation } = require('../common');
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    transform,
    domain: 'dyson.co.il',
    zipcode: '',
  },
  implementation,
};
