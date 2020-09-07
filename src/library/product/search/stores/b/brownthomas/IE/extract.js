const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    transform,
    domain: 'brownthomas.com',
    zipcode: '',
  },
};
