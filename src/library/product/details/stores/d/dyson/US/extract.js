const { transform } = require('../transform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'dyson',
    transform,
    domain: 'dyson.com',
    zipcode: '',
  },
  implementation,
};
