
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'aptekagemini',
    // nextLinkSelector: 'li[class*="nextPage"] > a[class*="pagination__"], a.pagination__step--next',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'ol.ais-Hits-list li:nth-last-child(1)',
    noResultsXPath: '//div/h2[@class=""] | //ol[contains(@class,"ais-Hits-list")][count(*)=0]',
    openSearchDefinition: {
      template: 'https://www.aptekagemini.pl/znajdz?query={searchTerms}&page={page}',
    },
    domain: 'aptekagemini.pl',
    zipcode: '',
  },
};
