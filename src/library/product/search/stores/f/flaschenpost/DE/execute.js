
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    domain: 'flaschenpost.de',
    url: "https://www.flaschenpost.de/katalog/suche/?searchTerm={searchTerms}",
    loadedSelector: 'p[class="fontSizeM"]',
    noResultsXPath: null,
    zipcode: '28203',
  },
};
