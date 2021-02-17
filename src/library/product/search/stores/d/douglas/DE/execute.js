
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    domain: 'douglas.de',
    url: 'https://www.douglas.de/de/search?q={searchTerms}',
    loadedSelector: 'div[class*=product-grid-column]',
    // noResultsXPath: '//h3[contains(text(),"0 Treffer")]',
    noResultsXPath: '//span[contains(.,"0 Treffer")]',
  },
};
