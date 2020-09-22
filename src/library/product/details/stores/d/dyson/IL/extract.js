const { implementation } = require('../common');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    transform: null,
    domain: 'dyson.co.il',
    zipcode: '',
  },
  implementation,
};
