
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'perfumesclub',
    nextLinkSelector: 'div[class="col-12 mar-b-3x"]>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'perfumesclub.com',
    zipcode: '',
  },
};
