
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    nextLinkSelector: 'li.pagination-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: '//center[@class="index-PageNotFoundContainer"]',
    openSearchDefinition: null,
    domain: 'myntra.com',
    zipcode: '',
  },
};
