const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shipt_heb_78414',
    transform: transform,
    domain: 'shop.shipt.com',
    zipcode: '78414',
  },
};
