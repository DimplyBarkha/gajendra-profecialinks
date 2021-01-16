
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'petburada',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#ProductPageProductList',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'petburada.tr',
    zipcode: "''",
  },
};
