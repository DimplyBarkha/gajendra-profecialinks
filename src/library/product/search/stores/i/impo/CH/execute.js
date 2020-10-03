
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'impo',
    domain: 'impo.ch',
    url: 'https://www.impo.ch/de/search/?text={searchTerms}',
    loadedSelector: 'li.list-page__item',
    noResultsXPath: '//div[@class="search-results__head-area"]',
  },
};
