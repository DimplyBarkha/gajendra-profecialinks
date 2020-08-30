
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'dyson',
    domain: 'dysoncanada.ca',
    url: 'https://www.dysoncanada.ca/en/search-results.html?searchText={searchTerms}&from=product',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and contains(@href, "from=support")] | //link[@rel="canonical" and contains(@href, "from=explore")]',
  },
};
