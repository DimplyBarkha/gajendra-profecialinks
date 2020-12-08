const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'fust',
    transform,
    domain: 'fust.ch',
    zipcode: '',
  },
};
