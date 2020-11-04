const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform,
    domain: 'ah.be',
    zipcode: '',
  },
};
