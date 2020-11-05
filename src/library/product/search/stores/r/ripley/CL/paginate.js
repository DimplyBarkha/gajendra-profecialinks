
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    nextLinkSelector: 'ul.pagination li:last-child a',
    mutationSelector: null,
    spinnerSelector: 'div.loading-screen',
    loadedSelector: 'div[class="catalog-page"]',
    noResultsXPath: '//div[@class="algolia-search-no-results"]',
    openSearchDefinition: null,
    domain: 'simple.ripley.cl',
    zipcode: '',
  },
};
