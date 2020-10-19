
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#product-search-results',
    noResultsXPath: "//div[@class='product-search-query']//span[contains(text(),'vastaavia tuotteita ei löytynyt')]",
    openSearchDefinition: null,
    domain: 'k-ruoka.fi',
    zipcode: '',
  },
};
