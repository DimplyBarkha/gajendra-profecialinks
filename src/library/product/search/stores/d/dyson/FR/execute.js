
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'dyson',
    domain: 'dyson.fr',
    url: 'https://www.dyson.fr/search-results.html?searchText={searchTerms}&from=product',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and contains(@href, "from=support")] | //link[@rel="canonical" and contains(@href, "from=explore")]',
  },
};
