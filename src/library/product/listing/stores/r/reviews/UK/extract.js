const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    urlTemplate: 'https://www.reviews.io/company-reviews/store/vype-e-cigarettes/{page}',
    resultsCountSelector: 'span.statistics__totalReviews span:nth-child(2) strong',
    numberResultPerPage: 20,
    transform,
    domain: 'reviews.co.uk',
    zipcode: '',
  },
};
