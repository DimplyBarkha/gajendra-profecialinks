
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    domain: 'londondrugs.com',
    loadedSelector: '.ld-sg-tabs__content',
    noResultsXPath: '//div[@class="error-page-message"] | //div[@class="search-no-results"]',
    zipcode: '',
  },
};
