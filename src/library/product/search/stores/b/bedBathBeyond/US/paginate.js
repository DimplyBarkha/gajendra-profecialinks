
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bedBathBeyond',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")]',
    openSearchDefinition: {
      template: 'https://www.bedbathandbeyond.com/store/s/{searchTerms}/{page}-48?removeInStock=true',
    },
    domain: 'bedbathandbeyond.com',
    zipcode: '',
  },
};
