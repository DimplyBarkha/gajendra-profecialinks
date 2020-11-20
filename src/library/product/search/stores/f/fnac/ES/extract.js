
const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
};
