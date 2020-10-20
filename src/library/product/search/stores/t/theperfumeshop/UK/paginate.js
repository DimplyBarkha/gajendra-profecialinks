
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    nextLinkSelector: 'div.product_grid__load_more, j-load_more',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product_grid__results',
    noResultsXPath: '//div[@class="product_grid__results"]',
    openSearchDefinition: null,
    domain: 'theperfumeshop.com',
    zipcode: '',
  },
};
