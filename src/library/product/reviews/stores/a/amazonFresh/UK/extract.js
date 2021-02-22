const {​​​​​ transform }​​​​​ = require('../../../../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazonFresh',
    transform,
    filterReviews: true,
    mergeType: null,
    domain: 'amazon.co.uk',
    zipcode: 'NW1 8AA',
  },
};
