
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'bruneau',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@id="no-result-top"]|//div[@id="product-page"]',
    openSearchDefinition: null,
    domain: 'bruneau.fr',
    zipcode: '',
  },
};
