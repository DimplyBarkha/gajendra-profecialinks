const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'EG',
    store: 'jumia',
    transform,
    domain: 'jumia.com',
    zipcode: '',
  },
};
