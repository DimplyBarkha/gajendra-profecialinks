const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
};
