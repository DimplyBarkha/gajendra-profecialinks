
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bedBathBeyond',
    domain: 'bedbathandbeyond.com',
    url: 'https://www.bedbathandbeyond.com/store/s/{searchTerms}/1-48?removeInStock=true',
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")] | /html[not(//div[starts-with(@class,"ProductGrid-inline")]//article)]',
    zipcode: '',
  },
};
