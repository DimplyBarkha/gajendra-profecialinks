
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    domain: 'snipes.com',
    url: 'https://www.snipes.com/search?q={searchTerms}&lang=de_DE',
    loadedSelector: 'div[class="b-product-grid js-product-grid"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
