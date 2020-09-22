
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class*="carouselItemsContainer"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'shopping.google.com',
    zipcode: '',
  },
};
