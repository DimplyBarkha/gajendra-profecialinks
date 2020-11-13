
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main[id="infinite- scroll - products"]',
    noResultsXPath: '//section/figure[@class="mq-grid-notfound mq-finder-not-found big"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
};
