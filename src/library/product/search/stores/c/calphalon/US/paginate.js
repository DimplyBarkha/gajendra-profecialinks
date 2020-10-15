
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'calphalon',
    nextLinkSelector: 'a.right_arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.product-grid',
    noResultsXPath: "//p[contains(text(),' did not return any results.')]",
    openSearchDefinition: null,
    domain: 'calphalon.com',
    zipcode: '',
  },
};
