const { transform } = require('./variantShared');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'MX',
    store: 'innovasport',
    transform,
    domain: 'innovasport.com',
    zipcode: '',
  },
};
