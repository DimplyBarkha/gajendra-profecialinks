const { transform } = require('./variantExtractorShared');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    transform,
    domain: 'mediaexpert.pl',
    zipcode: '',
  },
};
