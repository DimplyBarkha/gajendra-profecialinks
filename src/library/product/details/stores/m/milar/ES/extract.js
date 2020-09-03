const {transform} = require('./transform.js')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'milar',
    transform,
    domain: 'milar.es',
    zipcode: '',
  },
};
