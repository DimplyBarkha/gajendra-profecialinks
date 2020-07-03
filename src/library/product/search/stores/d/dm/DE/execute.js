
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    url: 'https://www.dm.de/search?query={searchTerms}&searchType=product',
    loadedSelector: '[data-dmid="product-tile-container"]',
    noResultsXPath: '//div[@data-dmid="content-search-count-container"] | //h2[@data-dmid="fallback-tips-headline"] | //div[contains(@data-dmid,"search-container")]//p[contains(.,"Leider ist ein technischer Fehler aufgetreten")] | //div[@data-dmid="faq-search-container"]',
  },
};
