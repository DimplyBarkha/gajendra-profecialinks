
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'atticaBeauty',
    domain: 'atticadps.gr',
    url: 'https://www.atticadps.gr/eshop/search-results/?Query={searchTerms}',
    loadedSelector: 'div.main',
    noResultsXPath: '//div[@class="status" and contains(., "Λυπούμαστε...")]',
    zipcode: "''",
  },
};
