
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.home-product-cards',
    noResultsXPath: '//div[@class="no-results"]',
    openSearchDefinition: null,
    domain: 'carrefour.com.ar',
    zipcode: "''",
  },
};
