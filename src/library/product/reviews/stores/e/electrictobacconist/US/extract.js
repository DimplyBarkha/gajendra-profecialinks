const { transform } = require('../sharedTransform');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'electrictobacconist',
    transform,
    filterReviews: null,
    domain: 'electrictobacconist.com',
    zipcode: '',
  },
};
