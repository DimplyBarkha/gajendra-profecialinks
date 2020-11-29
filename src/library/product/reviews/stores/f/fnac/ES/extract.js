const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
};
