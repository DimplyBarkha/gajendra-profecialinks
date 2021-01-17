const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'sligro',
    transform,
    domain: 'sligro.nl',
    zipcode: '',
  },
};
