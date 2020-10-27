
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'handlaWillys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ax-product-grid[type-of-results="results"] > div > div > ax-product-puff.ax-product-grid-tile',
    noResultsXPath: '//div[contains(@class,"no-search-result")]',
    // openSearchDefinition: null,
    domain: 'willys.se',
    zipcode: '',
  },
};
