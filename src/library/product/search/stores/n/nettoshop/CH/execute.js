
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    domain: 'nettoshop.ch',
    url: 'https://www.nettoshop.ch/search?text={searchTerms}',
    loadedSelector: 'div .c-product-grid__item-wrapper',
    noResultsXPath: '//div[contains(@class,"c-search-result")]//h1[contains(.,"0 Ergebnisse")]',
    zipcode: '',
  },
};
