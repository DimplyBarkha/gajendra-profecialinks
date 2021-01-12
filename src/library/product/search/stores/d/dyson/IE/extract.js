const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'dyson',
    transform,
    domain: 'dyson.ie',
    zipcode: '',
  },
  implementation,
};