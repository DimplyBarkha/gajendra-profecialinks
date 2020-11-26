
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'falabella',
    nextLinkSelector: "button#testId-pagination-bottom-arrow-right",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'no-result')]",
    openSearchDefinition: null,
    domain: 'falabella.com',
    zipcode: '',
  },
};
