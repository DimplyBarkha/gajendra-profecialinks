const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'dyson',
    transform,
    domain: 'dyson.co.uk',
    zipcode: '',
  },
};
