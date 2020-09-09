
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'heathcotes',
    nextLinkSelector: 'li[class*="next_page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="products"]',
    noResultsXPath: '//*[contains(text(), "No products")]',
    openSearchDefinition: null,
    domain: 'heathcotes.co.nz',
    zipcode: '',
  },
};
