const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_fr',
    transform: transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};
