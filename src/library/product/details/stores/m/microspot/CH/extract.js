const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
};
