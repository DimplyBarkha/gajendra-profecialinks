
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#__next header + div + div>div',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'carrefour.pl',
    zipcode: '',
  },
};
