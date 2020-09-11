
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    nextLinkSelector: 'section[class*="bottom"] a[aria-label="Next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#searchresults-found-container',
    noResultsXPath: '//div[@id="searchresults-none-container"]',
    openSearchDefinition: null,
    domain: 'monclick.it',
    zipcode: '',
  },
};
