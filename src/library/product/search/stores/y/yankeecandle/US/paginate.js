
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'yankeecandle',
    nextLinkSelector: 'ul[class="pagination pagination-sm pull-right"] li[class="btn-next-page "] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'yankeecandle.com',
    zipcode: '',
  },
};
