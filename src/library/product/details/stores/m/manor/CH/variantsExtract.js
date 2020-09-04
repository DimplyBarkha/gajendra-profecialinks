const { transform } = require('../transform')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
