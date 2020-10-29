
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    domain: 'elkjop.no',
    url: "https://www.elkjop.no/search?SearchTerm='{searchTerms}'&search=&searchResultTab=",
    loadedSelector: '.sidebar',
    noResultsXPath: '//*[contains(@class, "no-search-result")]',
    zipcode: '',
  },
};
