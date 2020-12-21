const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'us',
    store: 'instacart_kroger',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '',
  },
};
