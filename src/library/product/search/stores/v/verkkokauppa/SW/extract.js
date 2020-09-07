const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SW',
    store: 'verkkokauppa',
    transform,
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
};
