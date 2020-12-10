
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    nextLinkSelector: 'a[aria-label*="Next page"]',
    mutationSelector: null,
    spinnerSelector: 'div[style="display: block;"] div[class*="Loader__Overlay-"]',
    loadedSelector: 'a[class="productImg__3fOOgAmO"] > picture > img',
    noResultsXPath: '//p[@class="resultsTitle__2yxTXNeW"]/span',
    zipcode: '',
    domain: 'totalwine.com',
  },
};
