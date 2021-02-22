const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: transform,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
};
