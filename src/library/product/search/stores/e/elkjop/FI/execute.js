
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'elkjop',
    domain: 'gigantti.fi',
    url: "https://www.gigantti.fi/search?SearchTerm='{searchTerms}'&search=&searchResultTab=",
    loadedSelector: '.sidebar',
    noResultsXPath: '//*[contains(@class, "no-search-result")]',
    zipcode: '',
  },
};
