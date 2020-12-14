const {transform}=require('../CL/format')

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    transform,
    domain: 'falabella.com',
    zipcode: '',
  },
};
