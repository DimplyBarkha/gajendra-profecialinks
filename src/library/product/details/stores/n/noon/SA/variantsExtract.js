
const { transform } = require('../formatVariants')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    transform,
    domain: 'noon.com',
    zipcode: '',
  },
};
