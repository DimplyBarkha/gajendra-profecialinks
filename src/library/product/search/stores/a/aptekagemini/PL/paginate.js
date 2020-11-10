
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    nextLinkSelector: 'li[class*="nextPage"] > a[class*="pagination__"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[class="ais-SortBy"]',
    noResultsXPath: '//div/h2[@class=""]',
    openSearchDefinition: null,
    domain: 'aptekagemini.pl',
    zipcode: '',
  },
};
