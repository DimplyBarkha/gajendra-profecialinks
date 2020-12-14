module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    domain: 'carrefour.it',
    url: 'https://www.carrefour.it/search?q={searchTerms}',
    loadedSelector: 'div[class="image-container"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
