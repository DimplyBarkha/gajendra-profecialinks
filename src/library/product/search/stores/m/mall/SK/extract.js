const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    transform: transform,
    domain: 'mall.com',
    zipcode: '',
  },
};
