const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PK',
    store: 'daraz',
    transform,
    domain: 'daraz.pk',
    zipcode: '',
  },
};
