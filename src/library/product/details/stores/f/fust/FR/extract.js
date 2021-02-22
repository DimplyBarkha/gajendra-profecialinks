const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'fust',
    transform,
    domain: 'fust.ch',
    zipcode: '',
  },
};
