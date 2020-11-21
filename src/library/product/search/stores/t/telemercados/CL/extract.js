const {transform}=require('../CL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'telemercados',
    transform,
    domain: 'telemercados.cl',
    zipcode: '',
  },
};
