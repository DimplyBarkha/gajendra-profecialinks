
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'transgourmet',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#products.clearfix.products-list',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'transgourmet.at',
    zipcode: "''",
  },
};
