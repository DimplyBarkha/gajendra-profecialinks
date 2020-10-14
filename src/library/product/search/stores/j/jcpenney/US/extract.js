const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    transform,
    domain: 'jcpenney.com',
    zipcode: '',
  },
};
