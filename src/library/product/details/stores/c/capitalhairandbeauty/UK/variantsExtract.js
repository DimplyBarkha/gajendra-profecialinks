const {transform} = require('../variantsFormat')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'capitalhairandbeauty',
    transform,
    domain: 'capitalhairandbeauty.co.uk',
    zipcode: "''",
  },
};
