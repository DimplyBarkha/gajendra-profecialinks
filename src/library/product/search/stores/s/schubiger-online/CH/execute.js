
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    domain: 'schubiger-online.ch',
    url: 'https://www.schubiger-online.ch/search/?text={searchTerms}',
    loadedSelector: 'div[class*="c-product-grid__item-wrapper"]',
    noResultsXPath: '//h1[contains(@id,"ember") and contains(concat(.,text()," ")," 0 ")]',
    zipcode: '',
  },
};
