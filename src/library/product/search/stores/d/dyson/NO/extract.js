const { transform } = require('../../../../shared');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'dyson',
    transform,
    domain: 'dyson.no',
    zipcode: '',
  },
  implementation,
};
