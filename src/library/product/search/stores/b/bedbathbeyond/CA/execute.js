
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.ca',
    url: 'https://www.bedbathandbeyond.ca/store/s/{searchTerms}?ta=typeahead&view=GRID',
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")] | /html[not(//div[starts-with(@class,"ProductGrid-inline")]//article)]',
    zipcode: '',
  },
};
