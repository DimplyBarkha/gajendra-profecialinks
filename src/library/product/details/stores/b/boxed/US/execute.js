
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    domain: 'boxed.com',
    loadedSelector: 'section#product-page',
    noResultsXPath: '//section[@id="error-page"] | //header//span[contains(text(), "Search Results")] | //div[@id="home-page"]',
    zipcode: '',
  },
};
