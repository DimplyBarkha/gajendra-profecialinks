const { implementation } = require('../TR/variantsExtract');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
