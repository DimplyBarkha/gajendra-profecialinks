
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    nextLinkSelector: '.d-xs-inline.d-l-none',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.rw',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]/div[@class="server-error"]',
    openSearchDefinition: null,
    domain: 'jumbo.com',
    zipcode: '',
  },
};
