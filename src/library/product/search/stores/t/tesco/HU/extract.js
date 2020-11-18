const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'tesco',
    transform,
    domain: 'tesco.hu',
    zipcode: '',
  },
};
