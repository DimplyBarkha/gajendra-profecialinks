const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'gracobaby',
    transform,
    domain: 'gracobaby.com',
    zipcode: '',
  },
};
