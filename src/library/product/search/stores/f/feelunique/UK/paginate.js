
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    nextLinkSelector: 'div[class="loadMore"] a',
    mutationSelector: 'div[class*="eba-product-listing"]',
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'feelunique.com',
  },
};
