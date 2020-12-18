const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_de',
    transform: transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
};

