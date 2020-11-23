const {transform}=require('../US/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'shoplet',
    transform,
    domain: 'shoplet.com',
    zipcode: '',
  },
};
