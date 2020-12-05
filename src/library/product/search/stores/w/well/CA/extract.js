const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'well',
    transform,
    domain: 'well.ca',
    zipcode: '',
  },
};
