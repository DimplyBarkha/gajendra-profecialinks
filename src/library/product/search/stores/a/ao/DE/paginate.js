
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    nextLinkSelector: 'i.ico.ico-chevron-right.ico-lg.text-cta-action',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main.lister',
    noResultsXPath: 'div.no-results',
    openSearchDefinition: null,
    domain: 'ao.de',
    zipcode: '',
  },
};
