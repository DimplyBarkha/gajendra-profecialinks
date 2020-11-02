const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    transform: transform,
    domain: 'mimovrste.com',
    zipcode: '',
  },
};
