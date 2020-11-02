
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'build',
    nextLinkSelector: "a[role='button'].js-next-page:not([disabled])",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div.js-product-grid-container",
    noResultsXPath: "//div[@id='no-results-page']",
    openSearchDefinition: null,
    domain: 'build.com',
    zipcode: '',
  },
};
