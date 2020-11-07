
const { transform } = require('../formatVariant.js');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    transform: transform,
    domain: 'apotal.de',
    zipcode: '',
  },
};
