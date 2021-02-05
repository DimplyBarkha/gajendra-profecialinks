
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    domain: 'carrefour.it',
    url: 'https://www.carrefour.it/search?q={searchTerms}&sz=150',
    loadedSelector: 'div.product-item',
    noResultsXPath: '//div[contains(@class,"container")]/h1[contains(text(),"0 risultati per")]',
    zipcode: '',
  },
};
