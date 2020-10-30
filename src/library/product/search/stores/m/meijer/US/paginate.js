
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    nextLinkSelector: 'body > main > div.main-content > div:nth-child(6) > div.product-grid.js-product-grid > div.product__list--wrapper > div.page_count_pagination > div > div > a.arrows.js-right-last-arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'meijer.com',
    zipcode: '',
  },
};
