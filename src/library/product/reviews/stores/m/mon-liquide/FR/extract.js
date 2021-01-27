const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    transform,
    domain: 'mon-liquide.fr',
    zipcode: "''",
  },
};
