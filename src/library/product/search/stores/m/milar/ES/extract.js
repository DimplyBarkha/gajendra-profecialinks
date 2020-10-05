const {transform} = require('../format.js')
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
