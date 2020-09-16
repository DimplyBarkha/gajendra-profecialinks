
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'elkjop',
    domain: 'elgiganten.dk',
    url: "https://www.elgiganten.dk/search?SearchTerm='{searchTerms}'&search=&searchResultTab=",
    loadedSelector: '.forward',
    noResultsXPath: '//*[contains(@class, "no-search-result")]',
    zipcode: '',
  },
};
