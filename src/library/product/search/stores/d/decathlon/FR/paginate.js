
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#in-product-list',
    noResultsXPath: '//div[@class="left"]//div[@class="title"]',
    openSearchDefinition: null,
    domain: 'decathlon.fr',
    zipcode: '',
  },
};
