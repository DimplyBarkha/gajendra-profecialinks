const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    transform,
    domain: 'metro.ca',
    zipcode: '',
  },
};
