const { transform } = require('./variantsFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    transform,
    domain: 'idealo.de',
    zipcode: '',
  },
};
