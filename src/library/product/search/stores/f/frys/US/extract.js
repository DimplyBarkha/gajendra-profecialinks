const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'frys',
    transform : transform,
    domain: 'frys.com',
    zipcode: '',
  },
};
