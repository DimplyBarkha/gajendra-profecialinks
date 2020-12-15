const { transform } = require('./variantFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'surlatable',
    transform,
    domain: 'surlatable.com',
    zipcode: "''",
  },
};
