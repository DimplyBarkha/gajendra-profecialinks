const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    transform,
    domain: 'ah.nl',
    zipcode: '',
  },
};
