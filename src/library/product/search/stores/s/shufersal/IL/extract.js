const {transform}=require('./format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'shufersal',
    transform,
    domain: 'shufersal.co.il',
    zipcode: '',
  },
};
