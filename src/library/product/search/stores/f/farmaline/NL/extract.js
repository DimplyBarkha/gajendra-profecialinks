const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'farmaline',
    transform,
    domain: 'farmaline.nl',
    zipcode: '',
  },
};
