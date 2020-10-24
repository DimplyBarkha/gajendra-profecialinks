
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="imageContainer"]>img',
    noResultsXPath: '//div[contains(@class,"layout")]/div[contains(@class,"searchNotFound")]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'carrefour.com.br',
  },
};
