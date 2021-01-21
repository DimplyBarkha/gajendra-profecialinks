const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'UK',
    store: 'reviews',
    urlTemplate: 'https://www.reviews.io/company-reviews/store/{id}/{page}',
    resultsCountSelector: 'span.statistics__totalReviews span:nth-child(2) strong',
    numberResultPerPageXPath: 'count(//div[@class="Review "])',
    /* eslint-disable */
    regExpForIdFromUrl: '([^\/]+$)',
    /* eslint-enable */
    transform,
    domain: 'reviews.co.uk',
    zipcode: '',
  },
};
