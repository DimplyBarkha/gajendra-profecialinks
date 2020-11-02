
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'build',
    domain: 'build.com',
    url: 'https://www.build.com/search?term={searchTerms}',
    loadedSelector: "div.js-product-grid-container",
    noResultsXPath: "//div[@id='no-results-page']",
    zipcode: '',
  },
};
