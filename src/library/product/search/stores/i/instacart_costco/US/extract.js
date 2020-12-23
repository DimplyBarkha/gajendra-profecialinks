const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_costco',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '98027',
  },
};
