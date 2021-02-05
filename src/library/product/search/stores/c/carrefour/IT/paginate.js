
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-item',
    noResultsXPath: '//div[contains(@class,"container")]/h1[contains(text(),"0 risultati per")]',
    openSearchDefinition: null,
    domain: 'carrefour.it',
    zipcode: '',
  },
};
