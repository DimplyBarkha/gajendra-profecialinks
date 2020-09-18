
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    domain: 'gigantti.fi',
    url: 'https://www.gigantti.fi/search?SearchTerm={searchTerms}&search=&searchResultTab=',
    loadedSelector: 'div.product-list-container',
    noResultsXPath: '//div[contains(@class, "recommended-products")]',
    zipcode: '',
  },
};
