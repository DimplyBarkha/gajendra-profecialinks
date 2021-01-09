const { transform } = require('../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    transform,
    domain: 'saksfifthavenue.com',
    zipcode: '',
  },
};
