const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    transform: transform,
    domain: 'courir.com',
    zipcode: '',
  },
};
