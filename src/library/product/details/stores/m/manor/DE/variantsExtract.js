const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    transform,
    domain: 'manor.ch',
    zipcode: '',
  },
};
