const {transform}=require('../../../../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'metro',
    transform,
    domain: 'metro.ca',
    zipcode: '',
  },
};
