const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'impo',
    transform,
    domain: 'impo.ch',
    zipcode: '',
  },
};
