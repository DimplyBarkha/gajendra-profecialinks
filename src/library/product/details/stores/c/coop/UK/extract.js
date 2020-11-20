const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    transform,
    domain: 'coop.co.uk',
    zipcode: '',
  },
};
