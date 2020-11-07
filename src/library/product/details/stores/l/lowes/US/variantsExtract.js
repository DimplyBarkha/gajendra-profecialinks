const { transform } = require('./variantsformat.js');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: transform,
    domain: 'lowes.com',
    zipcode: '',
  },
};
