const { transform } = require("../variantTransform");
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    transform,
    domain: 'debenhams.com',
    zipcode: '',
  },
};
