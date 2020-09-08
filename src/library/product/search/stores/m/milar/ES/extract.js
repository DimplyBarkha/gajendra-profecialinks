const {transform} = require('./transform.js')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'milar',
    transform,
    domain: 'milar.es',
    zipcode: '',
  },
};
