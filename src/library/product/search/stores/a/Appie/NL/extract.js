const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'Appie',
    transform,
    domain: 'appie.nl',
    zipcode: '',
  },
};
