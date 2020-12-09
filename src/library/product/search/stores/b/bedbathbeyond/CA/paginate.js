
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bedbathbeyond',
    nextLinkSelector: null,
    nextLinkXPath: '//ul[contains(@class, "Pagination")]//a[@aria-current]/../../following-sibling::li',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class^="ProductGrid-inline"] article img[data-locator="product_tile_image"]',
    noResultsXPath: '//p[contains(.,"No Search Results For")] | /html[not(//div[starts-with(@class,"ProductGrid-inline")]//article)]',
    // openSearchDefinition: {
    //   template: 'https://www.bedbathandbeyond.ca/store/s/{searchTerms}/{page}-24',
    // },
    openSearchDefinition: null,
    domain: 'bedbathbeyond.ca',
    zipcode: '',
  },
};
