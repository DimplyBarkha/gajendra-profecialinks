
const {transform} = require('../format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'tiendanimal',
    transform,
    domain: 'tiendanimal.es',
    zipcode: '',
  },
};
