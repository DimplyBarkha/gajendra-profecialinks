
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    nextLinkSelector: '.pagination>li:nth-child(3)>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'pacson.se',
    zipcode: '',
  },
};
