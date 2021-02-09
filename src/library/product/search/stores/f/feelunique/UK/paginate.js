
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="Product"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'feelunique.com',
    zipcode: '',
  },
};
