
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'StaplesAdvantage',
    nextLinkSelector: 'li.prevnext.last',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'span.search-mean-count',
    noResultsXPath: '//div[@class="no-search-container outer-wrap"]',
    openSearchDefinition: null,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
};
