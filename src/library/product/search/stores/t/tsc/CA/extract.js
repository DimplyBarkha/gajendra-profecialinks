const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform,
    domain: 'tsc.ca',
    zipcode: '',
  },
};
