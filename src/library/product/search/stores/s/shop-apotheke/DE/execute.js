module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    domain: 'shop-apotheke.com',
    url: 'https://www.shop-apotheke.com/search.htm?&page={page}&query={searchTerms}&isCompetitiveProducts=y&g=y',
    //&isCompetitiveProducts=y&g=y
    loadedSelector: 'ul div[data-qa-id="result-list-entry"]',
    noResultsXPath: '//h1[contains(.,"Kein Suchergebnis gefunden")]',
  },
};
