const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    transform,
    domain: 'linsenmax.ch',
    zipcode: '',
  },
};
