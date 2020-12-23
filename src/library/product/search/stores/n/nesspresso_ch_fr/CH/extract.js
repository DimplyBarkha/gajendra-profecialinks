const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_fr',
    transform: transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
