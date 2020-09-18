const { transform } = require('../SE/shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'elon',
    transform,
    domain: 'elon.se',
    zipcode: '',
  },
};
