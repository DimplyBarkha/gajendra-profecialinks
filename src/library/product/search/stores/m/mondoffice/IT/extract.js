const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
