const {transform} = require('../variantsFormat')
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: "''",
  },
};
