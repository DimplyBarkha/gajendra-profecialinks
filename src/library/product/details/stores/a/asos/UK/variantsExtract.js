const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform,
    domain: 'asos.com',
    zipcode: ''
  },
};