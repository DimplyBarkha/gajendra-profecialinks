const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    transform,
    domain: 'officedepot.com',
    zipcode: '',
  },
};