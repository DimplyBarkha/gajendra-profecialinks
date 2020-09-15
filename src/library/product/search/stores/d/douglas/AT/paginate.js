
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    nextLinkSelector: 'div.pagination a.pagination__arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-tile',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'douglas.at',
    zipcode: '',
  },
};
