const { transform } = require('../../nespressoTransform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_fr',
    transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
