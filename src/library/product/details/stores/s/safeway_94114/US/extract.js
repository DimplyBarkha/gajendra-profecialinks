const { transform } = require('../../safeway/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'safeway_94114',
    transform,
    domain: 'safeway.com',
    zipcode: '94114',
  },
};
