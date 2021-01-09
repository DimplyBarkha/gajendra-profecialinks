const {transform}=require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'shufersal',
    transform,
    domain: 'shufersal.co.il',
    zipcode: '',
  },
};
