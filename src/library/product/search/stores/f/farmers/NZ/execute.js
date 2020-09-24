
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    domain: 'farmers.co.nz',
    url: 'https://www.farmers.co.nz/search?SearchTerm={searchTerms}',
    loadedSelector: 'ul.ish-productList li:first-child img',
    noResultsXPath: "//div[contains(@class, 'search-result-main-block-contents')]//h1[contains(text(),'No Results Found:')]",
    zipcode: '',
  },
};
