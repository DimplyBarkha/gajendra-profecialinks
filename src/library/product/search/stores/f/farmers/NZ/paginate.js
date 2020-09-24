
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'farmers',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.ish-productList li:first-child img',
    noResultsXPath: "//div[contains(@class, 'search-result-main-block-contents')]//h1[contains(text(),'No Results Found:')]",
    openSearchDefinition: { template: 'https://www.farmers.co.nz/Page-{page}?SearchTerm={searchTerms}' },
    domain: 'farmers.co.nz',
    zipcode: '',
  },
};
