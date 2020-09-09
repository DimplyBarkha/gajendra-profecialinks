
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.ld-sg-tabs__content',
    noResultsXPath: '//div[@class="error-page-message"]',
    openSearchDefinition: null,
    domain: 'londondrugs.com',
    zipcode: '',
  },
};
