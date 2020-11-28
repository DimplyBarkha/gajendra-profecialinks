const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'spar',
    transform,
    domain: 'spar.hu',
    zipcode: '',
  },
};
