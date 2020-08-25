const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'boots',
    transform,
    domain: 'boots.ie',
    zipcode: '',
  },
};
