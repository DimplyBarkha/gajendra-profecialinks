const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    transform,
    domain: 'brownthomas.com',
    zipcode: '',
  },
};
