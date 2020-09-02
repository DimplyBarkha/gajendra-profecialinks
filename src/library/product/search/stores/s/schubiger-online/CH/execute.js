
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    domain: 'schubiger-online.ch',
    url: 'https://www.schubiger-online.ch/search/?text={searchTerms}',
    loadedSelector: 'div[class*="c-product-grid__item-wrapper"]',
    noResultsXPath: '//*[contains(text(),"0 results")]',
    zipcode: '',
  },
};
