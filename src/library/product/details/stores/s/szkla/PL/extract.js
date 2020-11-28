const {transform}=require('../PL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'szkla',
    transform,
    domain: 'szkla.com',
    zipcode: '',
  },
};
