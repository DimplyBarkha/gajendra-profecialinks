
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    domain: 'staples.co.uk',
    loadedSelector: 'div#skuTabReviews',
    noResultsXPath: '//div[@class="mc2 NoSearchResults clear"]',
    reviewUrl: 'https://www.staples.co.uk/ref/cbs/{id}.html?Effort_Code=WW&Find_Number={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
