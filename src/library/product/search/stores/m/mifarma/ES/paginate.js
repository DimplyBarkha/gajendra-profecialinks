
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    nextLinkSelector: '.ais-pagination--item.ais-pagination--item__next > a.ais-pagination--link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mifarma.es',
    zipcode: '',
  },
};
