
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    // nextLinkSelector: 'div.eba-component.loadMoreContainer',
    nextLinkSelector: null,
    mutationSelector: null,
    // spinnerSelector: 'div[class="loadMoreLoader"]',
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'feelunique.com',
    zipcode: '',
  },
};
