
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bedBathBeyond',
    domain: 'bedbathandbeyond.ca',
    url: 'https://www.bedbathandbeyond.ca/store/s/{searchTerms}/1-48?removeInStock=true',
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")] | /html[not(//div[starts-with(@class,"ProductGrid-inline")]//article)]',
    zipcode: '',
  },
};
