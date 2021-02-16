const { transform } = require('./variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PT',
    store: 'sweetcare',
    transform,
    domain: 'sweetcare.pt',
    zipcode: "''",
  },
};
