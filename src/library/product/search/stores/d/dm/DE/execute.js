
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    url: 'https://www.dm.de/search?query={searchTerms}',
    loadedSelector: 'div[data-dmid=product-grid-container]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    zipcode: '',
  },
};
