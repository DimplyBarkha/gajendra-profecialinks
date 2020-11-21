
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    nextLinkSelector: 'a#paginationPageNext[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#siteContent',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'viking.de',
    zipcode: '',
  },
};
