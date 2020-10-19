
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    domain: 'k-ruoka.fi',
    url: 'https://www.k-ruoka.fi/kauppa/tuotehaku?haku={searchTerms}',
    loadedSelector: 'ul#product-search-results',
    noResultsXPath: "//div[@class='product-search-query']//span[contains(text(),'vastaavia tuotteita ei löytynyt')]",
    zipcode: '',
  },
};
