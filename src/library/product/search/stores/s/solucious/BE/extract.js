const {transform}=require('../BE/format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'solucious',
    transform,
    domain: 'solucious.be',
    zipcode: '',
  },
};
