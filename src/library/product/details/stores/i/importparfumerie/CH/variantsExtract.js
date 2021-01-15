const { transform } = require('./variantFormat');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'importparfumerie',
    transform,
    domain: 'importparfumerie.ch',
    zipcode: "''",
  },
};
