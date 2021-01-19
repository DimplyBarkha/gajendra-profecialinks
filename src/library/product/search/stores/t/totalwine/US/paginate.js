module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    nextLinkSelector: 'a[aria-label*="Next page"]',
    mutationSelector: null,
    spinnerSelector: 'div[style*="block"] img[class*="Spinner"] ',
    loadedSelector: 'a[class="productImg__3fOOgAmO"] > picture > img',
    noResultsXPath: '//p[@class="resultsTitle__2yxTXNeW"]/span | //div[contains(.,"Please check your spelling")]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'totalwine.com',
  },
};
