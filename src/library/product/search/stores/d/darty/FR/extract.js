const { transform } = require('../format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform: transform,
    domain: 'darty.com',
    zipcode: '',
  },
};
