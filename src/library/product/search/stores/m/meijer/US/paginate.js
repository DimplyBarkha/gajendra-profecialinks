
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    nextLinkSelector: 'body > main > div.main-content > div:nth-child(7) > div.product-grid.js-product-grid > div.plp-pagination.js-plp-pagination > div > a.arrows.js-right-last-arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'meijer.com',
    zipcode: '',
  },
};
