const { transform } = require('../variantsFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  },
};
