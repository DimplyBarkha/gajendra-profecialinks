const { transform } = require('../CA/format');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
};
