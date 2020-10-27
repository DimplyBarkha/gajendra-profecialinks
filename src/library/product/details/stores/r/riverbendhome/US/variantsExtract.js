const {transform} = require('../variantsFormat')

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    transform,
    domain: 'riverbendhome.com',
    zipcode: "''",
  },
};
