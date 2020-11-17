
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'ahlsell',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.products.jsProductList.list-view',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'ahlsell.se',
    zipcode: "''",
  },
};
