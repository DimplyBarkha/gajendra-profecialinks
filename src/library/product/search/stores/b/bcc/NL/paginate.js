
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    nextLinkSelector: '.pagination li.active + li a',
    mutationSelector: null,
    spinnerSelector: '#global-loading-indicator[style="display: none;"]',
    loadedSelector: '.products-container',
    noResultsXPath: '//div[@class=\'no-search-results\']',
    openSearchDefinition: null,
    domain: 'bcc.nl',
    zipcode: '',
  },
};
