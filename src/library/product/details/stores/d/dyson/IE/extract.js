const { transform } = require('../transform');

const { implementation } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'dyson',
    transform,
    domain: 'dyson.ie',
    zipcode: '',
  },
  implementation,
};
