module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    nextLinkSelector: '.pagination-next>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'figure[class="photo-wrapper"]',
    noResultsXPath: '//div[@class="column-left"]',
    openSearchDefinition: null,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
};
