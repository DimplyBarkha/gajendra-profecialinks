
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'p1000',
    transform: transform,
    domain: 'p1000.co.il',
    zipcode: '',
  },
};
