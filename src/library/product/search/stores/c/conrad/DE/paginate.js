module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    nextLinkSelector: 'ul.pagination__list li:last-child button.pagination__button',
    mutationSelector: 'p.resultsListHeadline',
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//main//div[@class="searchView"]//div[contains(@class, "resultsListTitle--zeroResultPage")]/h1',
    resultsDivSelector: null,
    domain: 'conrad.de',
    zipcode: '',
  },
};
