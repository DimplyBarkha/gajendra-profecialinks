const { transform } = require('../variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: '',
  },
};
