
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    nextLinkSelector: 'li.pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#epoq_resultrows',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'manor.ch',
    zipcode: "''",
  },
};
