const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
