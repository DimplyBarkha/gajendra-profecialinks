
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    domain: 'theperfumeshop.com',
    url: null,
    loadedSelector: 'div.product_grid__results',
    noResultsXPath: '//div[@class="product_grid__results"]',
    zipcode: '',
  },
};
