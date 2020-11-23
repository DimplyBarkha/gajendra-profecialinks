
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    nextLinkSelector: '//li[@class="paginate-item" and position() = (last()-1)]/button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'fnac.es',
    zipcode: "''",
  },
};
