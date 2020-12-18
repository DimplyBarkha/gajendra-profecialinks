
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    // nextLinkSelector: 'a[class="page-link next"]',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product-listing product-grid"] li',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.marionnaud.fr/search?q={searchTerms}%3Arank-desc&sort=&page={page}&pageSize=100',
      },
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
