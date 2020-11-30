
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product__list-container > div > article:not([class="no-hover"])',
    noResultsXPath: null,
    domain: 'kruidvat.nl',
    openSearchDefinition: {
      // template: 'https://www.kruidvat.nl/search?q={aftersun}&searchType=manual&page={page}&size=20',
      // template: 'https://www.kruidvat.nl/search?q=48+uur+werking&searchType=manual&page={page}&size=20',
      template: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual&page={page}&size=20',
    },
  },
};
