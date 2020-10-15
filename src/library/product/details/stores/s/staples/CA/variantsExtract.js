const {transform} = require('../variantsFormat')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    transform,
    domain: 'staples.ca',
    zipcode: "''",
  },
};
