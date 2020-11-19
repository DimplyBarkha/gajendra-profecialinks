const {transform}=require('../US/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shoplet',
    transform,
    domain: 'shoplet.com',
    zipcode: '',
  },
};
