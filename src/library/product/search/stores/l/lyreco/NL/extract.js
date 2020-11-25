const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
