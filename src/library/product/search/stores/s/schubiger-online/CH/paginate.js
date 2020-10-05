
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="c-product-grid__item-wrapper"]',
    noResultsXPath: '//h1[contains(@id,"ember") and contains(concat(.,text()," ")," 0 ")]',
    openSearchDefinition: null,
    domain: 'schubiger-online.ch',
    zipcode: '',
  },
};
