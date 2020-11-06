
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.us',
    url: 'https://www.bedbathandbeyond.com/store/s/{searchTerms}?ta=typeahead',
    loadedSelector: "section[class='productSearch'] div[role='region'] article[class *='Card-inline_'] img[data-locator='product_tile_image']",
    noResultsXPath: "//p[contains(@class,'SearchResultsFound_')]",
    zipcode: '',
  },
};
