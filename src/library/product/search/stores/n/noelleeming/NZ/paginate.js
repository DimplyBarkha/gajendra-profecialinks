
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'noelleeming',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.inner.product-list__item img',
    noResultsXPath: "//h1[contains(@class, 'category-title')]/span[contains(text(), 'No Results')]",
    openSearchDefinition: {
      template: 'https://www.noelleeming.co.nz/search.html?q={searchTerms}&page={page}',
    },
    domain: 'noelleeming.co.nz',
    zipcode: '',
  },
};
