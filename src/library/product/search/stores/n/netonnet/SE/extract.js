const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'netonnet',
    transform,
    domain: 'netonnet.se',
    zipcode: '',
  },
};
