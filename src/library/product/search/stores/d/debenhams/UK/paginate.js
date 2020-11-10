
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    nextLinkSelector: "nav.pw-pagination.dbh-pagination-bottom button.pw-pagination__next:not([disabled])",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div.t-product-details__main-wrapper",
    noResultsXPath: "//div[contains(@class, 't-generic-error')]//h3[contains(@class, 't-generic-error-title')]",
    openSearchDefinition: null,
    domain: 'debenhams.com',
    zipcode: '',
  },
};
