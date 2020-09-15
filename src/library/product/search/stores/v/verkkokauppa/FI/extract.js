//const { transform } = require('../../../../shared');
const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    transform,
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
};
