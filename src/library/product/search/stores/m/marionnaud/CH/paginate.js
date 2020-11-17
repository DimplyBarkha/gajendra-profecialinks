
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.container-fluid>div.more-data-loader > div.container-fluid, container-fluid--max-width',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'marionnaud.ch',
    zipcode: '',
  },
};
