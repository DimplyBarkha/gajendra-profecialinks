const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'Efarma',
    transform: transform,
    domain: 'efarma.com',
    zipcode: '',
  },
};
