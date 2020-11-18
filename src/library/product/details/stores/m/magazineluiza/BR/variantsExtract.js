const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    transform,
    domain: 'magazineluiza.com.br',
    zipcode: '',
  },
};
