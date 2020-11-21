const {transform}=require('../CL/format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'telemercados',
    transform,
    domain: 'telemercados.cl',
    zipcode: '',
  },
};
