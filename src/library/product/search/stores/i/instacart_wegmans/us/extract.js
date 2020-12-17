const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'us',
    store: 'instacart_wegmans',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '',
  },
};
