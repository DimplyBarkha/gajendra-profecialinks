
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'asos_mweb',
    domain: 'asos.com',
    url: 'https://www.asos.com/search/?q={searchTerms}',
    loadedXPath: '//article[@data-auto-id="productTile"]',
    noResultsXPath: '//h2[contains(@class,"grid-text__title")][contains(text(),"NOTHING MATCHES YOUR SEARCH")]',
  },
};
