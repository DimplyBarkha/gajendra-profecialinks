
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    nextLinkSelector: '#paging-top > p > span > a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'notino.de',
    zipcode: '',
  },
};
