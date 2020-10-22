
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'total_wine_95825',
    nextLinkSelector: 'a[aria-label*="Next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a[class="productImg__3fOOgAmO"] > picture > img',
    noResultsXPath: '//p[@class="resultsTitle__2yxTXNeW"]/span',
    openSearchDefinition: null,
    zipcode: "'95825",
    domain: 'totalwine.com',
  },
};
