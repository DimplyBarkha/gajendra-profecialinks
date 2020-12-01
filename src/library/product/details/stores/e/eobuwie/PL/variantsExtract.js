const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    transform,
    domain: 'eobuwie.com.pl',
    zipcode: '',
  },
};
