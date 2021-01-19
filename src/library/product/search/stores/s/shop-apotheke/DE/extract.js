const { transform } = require('../DE/transform'); 
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
  },
};
