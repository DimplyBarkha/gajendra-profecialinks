const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'groo',
    transform: transform,
    domain: 'groo.co.il',
    zipcode: '',
  },
};
