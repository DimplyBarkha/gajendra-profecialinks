
const { transform } = require('../variantsFormat');
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
