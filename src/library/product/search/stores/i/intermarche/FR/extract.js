const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    transform,
    domain: 'intermarche.com',
    zipcode: '',
  },
};
