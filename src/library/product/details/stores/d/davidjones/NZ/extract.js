const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
};
