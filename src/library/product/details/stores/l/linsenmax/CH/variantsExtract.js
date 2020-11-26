const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    transform,
    domain: 'linsenmax.ch',
    zipcode: '',
  },
};
