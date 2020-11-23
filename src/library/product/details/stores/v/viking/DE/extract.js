const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    transform: transform,
    domain: 'viking.de',
    zipcode: '',
  },
};
