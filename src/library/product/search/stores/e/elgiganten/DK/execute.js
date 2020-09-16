
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    domain: 'elgiganten.dk',
    url: 'https://www.elgiganten.dk/search?SearchTerm={searchTerms}&search=&searchResultTab=',
    loadedSelector: 'div.product-list-container',
    noResultsXPath: '//section[contains(@class,"no-search-result")]',
    zipcode: '',
  },
};
