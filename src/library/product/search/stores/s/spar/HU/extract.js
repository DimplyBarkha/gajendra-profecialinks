const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'spar',
    transform,
    domain: 'spar.hu',
    zipcode: '',
  },
};
