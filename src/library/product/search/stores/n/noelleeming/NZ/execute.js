
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'noelleeming',
    domain: 'noelleeming.co.nz',
    url: 'https://www.noelleeming.co.nz/search.html?q={searchTerms}',
    loadedSelector: '.inner.product-list__item img',
    noResultsXPath: "//h1[contains(@class, 'category-title')]/span[contains(text(), 'No Results')]",
    zipcode: '',
  },
};
