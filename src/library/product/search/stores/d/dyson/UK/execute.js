
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'dyson',
    domain: 'dyson.co.uk',
    url: 'https://www.dyson.co.uk/search-results.html?searchText={searchTerms}&from=product',
    loadedSelector: '#Products-Data .search-count',
    noResultsXPath: '//div[@id="Products-Data"]//div[@class="search-empty"] | //link[@rel="canonical" and contains(@href, "from=support")] | //link[@rel="canonical" and contains(@href, "from=explore")]',
  },
};
