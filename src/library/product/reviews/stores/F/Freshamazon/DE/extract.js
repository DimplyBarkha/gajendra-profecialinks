const { transform } = require('../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'Freshamazon',
    transform: transform,
    filterReviews: true,
    mergeType: null,
    domain: 'amazon.de',
    zipcode: '10243',
  },
};
