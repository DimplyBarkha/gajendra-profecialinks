const { transform } = require('../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    transform,
    domain: 'nicokick.com',
    zipcode: '',
  },
};
