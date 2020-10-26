const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    transform: transform,
    domain: 'foodsaver.com',
    zipcode: '',
  },
};
