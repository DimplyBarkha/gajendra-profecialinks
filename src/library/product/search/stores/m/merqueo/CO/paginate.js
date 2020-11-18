
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.main-layout',
    noResultsXPath: '//figure[@class="mq-grid-notfound mq-finder-not-found big"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
};
