
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
      template: 'https://www.marionnaud.fr/maquillage/teint/blush/c/M0103?q=%3Arank-desc&page={page}&pageSize=20',
      },
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
