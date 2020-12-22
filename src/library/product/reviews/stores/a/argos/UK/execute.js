
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    domain: 'argos.co.uk',
    loadedSelector: 'div[class*="container"]',
    noResultsXPath: '//div[contains(@class,"ErrorPagestyles__Column-sc-1xry310-2 chdxit")]',
    reviewUrl: 'https://www.argos.co.uk/product/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
