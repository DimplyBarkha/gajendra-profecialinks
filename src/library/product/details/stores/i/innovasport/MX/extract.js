const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'innovasport',
    transform,
    domain: 'innovasport.com',
    zipcode: '',
  },
};
