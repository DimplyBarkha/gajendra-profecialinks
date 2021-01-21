const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/listing/extract',
  parameterValues: {
    country: 'US',
    store: 'juul',
    urlTemplate: 'https://www.juul.com/shop/pods/{id}?&ag=CA&yoReviewsPage={page}',
    resultsCountSelector: 'div.total-reviews-search[total-reviews-search]',
    numberResultPerPageXPath: 'count(//div[contains(@class, "yotpo-review ")])',
    regExpForIdFromUrl: '([^\/]+$)',
    transform,
    domain: 'juul.com',
    zipcode: '',
  },
};
