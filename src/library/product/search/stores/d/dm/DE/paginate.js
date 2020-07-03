
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[data-dmid="product-tile-container"]',
    noResultsXPath: '//div[@data-dmid="content-search-count-container"] | //h2[@data-dmid="fallback-tips-headline"] | //div[contains(@data-dmid,"search-container")]//p[contains(.,"Leider ist ein technischer Fehler aufgetreten")] | //div[@data-dmid="faq-search-container"]',
    openSearchDefinition: {
      pageOffset: 0,
      template: 'https://www.dm.de/search?query={searchTerms}&searchType=product&currentPage={page}',
    },
    domain: 'dm.de',
  },
};
