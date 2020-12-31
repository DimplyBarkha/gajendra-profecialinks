const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '32821',
  },
};
