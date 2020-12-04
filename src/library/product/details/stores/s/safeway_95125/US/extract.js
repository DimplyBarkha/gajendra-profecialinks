const { transform } = require('../../safeway/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'safeway_95125',
    transform,
    domain: 'safeway.com',
    zipcode: '95125',
  },
};
