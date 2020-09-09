
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'heathcotes',
    domain: 'heathcotes.co.nz',
    url: 'https://www.heathcotes.co.nz/products?keywords={searchTerms}',
    loadedSelector: 'div[id="products"]',
    noResultsXPath: '//*[contains(text(), "No products")]',
    zipcode: '',
  },
};
