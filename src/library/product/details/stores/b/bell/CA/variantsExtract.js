const {transform} = require('../variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    transform,
    domain: 'bell.ca',
    zipcode: '',
  },
};
