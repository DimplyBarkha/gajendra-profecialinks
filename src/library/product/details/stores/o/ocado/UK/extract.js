const { transform } =  require('../../../../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    transform,
    domain: 'ocado.com',
    zipcode: '',
  },
};
