const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'restockit',
    transform,
    domain: 'restockit.com',
    zipcode: '',
  },
};
