
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'jpg',
    nextLinkSelector: "#Pager > span.scTrack.pager-arrow.next.formLabel",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'jpg.fr',
    zipcode: '',
  },
};
