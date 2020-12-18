const {transform}=require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
