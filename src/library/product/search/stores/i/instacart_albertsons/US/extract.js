const { transform } = require("../../../../shared");
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'instacart_albertsons',
    transform: transform,
    domain: 'instacart.com',
    zipcode: '83704',
  },
};
