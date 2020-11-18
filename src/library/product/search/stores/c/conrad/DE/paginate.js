
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    nextLinkSelector: 'div.pagination button.pagination__button:not(.disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//main//div[@class="searchView"]//div[contains(@class, "resultsListTitle--zeroResultPage")]/h1',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'conrad.de',
    zipcode: '',
  },
};
