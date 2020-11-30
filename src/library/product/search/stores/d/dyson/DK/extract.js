const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'dyson',
    transform,
    domain: 'dyson.dk',
    zipcode: '',
  },
  implementation,
};
