const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
};
