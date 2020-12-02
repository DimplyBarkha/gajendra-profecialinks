const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'macys',
    transform: transform,
    domain: 'macys.com',
    zipcode: '',
  },
};
