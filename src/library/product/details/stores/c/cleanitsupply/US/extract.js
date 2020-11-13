const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cleanitsupply',
    transform: transform,
    domain: 'cleanitsupply.com',
    zipcode: '',
  },
};
