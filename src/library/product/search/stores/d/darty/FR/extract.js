const { transform } = require('../../../../shared');
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
