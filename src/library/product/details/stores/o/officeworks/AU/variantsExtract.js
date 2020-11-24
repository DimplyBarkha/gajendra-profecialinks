const { transform } = require('./variantsFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    transform,
    domain: 'officeworks.com.au',
    zipcode: '',
  },
};
