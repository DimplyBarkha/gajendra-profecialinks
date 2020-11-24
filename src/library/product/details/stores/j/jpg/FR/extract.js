const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    transform: transform,
    domain: 'jpg.fr',
    zipcode: '',
  },
};
