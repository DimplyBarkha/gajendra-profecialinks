const {transform}=require('../ES/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    transform,
    domain: 'pccomponentes.com',
    zipcode: '',
  },
};
