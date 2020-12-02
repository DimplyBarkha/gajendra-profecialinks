const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'pinalli',
    transform: transform,
    domain: 'pinalli.it',
    zipcode: '',
  },
};
