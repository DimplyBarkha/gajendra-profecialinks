
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'dyson',
    domain: 'dyson.it',
    url: 'https://www.dyson.it/risultati-di-ricerca.html?searchText={searchTerms}&from=product',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and contains(@href, "from=support")] | //link[@rel="canonical" and contains(@href, "from=explore")]',
  },
};