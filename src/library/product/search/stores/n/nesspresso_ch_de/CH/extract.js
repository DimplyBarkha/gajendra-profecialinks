const { transform } = require('../../nespressoTransform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_de',
    transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
