const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cleanitsupply',
    transform: transform,
    domain: 'cleanitsupply.com',
    zipcode: '',
  },
};
