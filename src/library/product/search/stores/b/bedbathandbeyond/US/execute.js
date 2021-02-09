
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathandbeyond',
    domain: 'bedbathandbeyond.com',
    url: 'https://www.bedbathandbeyond.com/store/s/{searchTerms}/1-24',
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")] | /html[not(//div[starts-with(@class,"ProductGrid-inline")]//article)]',
    zipcode: '',
  },
};