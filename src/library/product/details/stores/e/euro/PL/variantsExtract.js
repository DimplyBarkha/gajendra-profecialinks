
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },
  // implementation,
};
