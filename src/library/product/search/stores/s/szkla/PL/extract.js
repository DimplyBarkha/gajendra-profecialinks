const {transform}=require('../PL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'szkla',
    transform,
    domain: 'szkla.com',
    zipcode: '',
  },
};
