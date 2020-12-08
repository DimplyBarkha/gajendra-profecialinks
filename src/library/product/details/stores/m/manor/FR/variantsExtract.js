const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
