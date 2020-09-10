
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    domain: 'elkjop.no',
    url: "https://www.elkjop.no/search?SearchTerm={searchTerms}&search=&searchResultTab=",
    loadedSelector: 'html body',
    noResultsXPath: '//p[@id="no-search-result"]',
    zipcode: '',
  },
};
