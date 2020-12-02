
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    nextLinkSelector: 'button#testId-pagination-top-arrow-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'no-result')]",
    openSearchDefinition: null,
    domain: 'falabella.com.ar',
    zipcode: '',
  },
};
