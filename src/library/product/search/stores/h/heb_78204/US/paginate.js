
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    nextLinkSelector: 'div a[aria-label*="go to next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'nav.paging-container',
    noResultsXPath: '//h1[contains(text(),"No results found for")]',
    openSearchDefinition: null,
    domain: 'heb.com',
    zipcode: '78204',
  },
};
