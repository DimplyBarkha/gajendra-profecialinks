
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'chewy',
    domain: 'chewy.com',
    url: 'https://www.chewy.com/s?query={searchTerms}',
    // loadedSelector: 'section.results-products.js-tracked-product-list',
    // noResultsXPath: '//h1[@class="cw-type__body cw-padding--none"]',
    zipcode: '',
  },
};
