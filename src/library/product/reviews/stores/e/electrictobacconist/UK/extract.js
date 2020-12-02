const { transform } = require('../sharedTransform');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'electrictobacconist',
    transform,
    filterReviews: null,
    domain: 'electrictobacconist.co.uk',
    zipcode: '',
  },
};
