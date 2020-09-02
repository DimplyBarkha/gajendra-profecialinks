
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="c-product-grid__item-wrapper"]',
    noResultsXPath: '//*[contains(text(),"0 results")]',
    openSearchDefinition: null,
    domain: 'schubiger-online.ch',
    zipcode: '',
  },
};
