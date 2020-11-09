
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    nextLinkSelector: "ul[class *='Pagination_'] li a[class *='__btnNext']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "section[class='productSearch'] div[role='region'] article[class *='Card-inline_'] img[data-locator='product_tile_image']",
    noResultsXPath: "//p[contains(@class,'SearchResultsFound_') and text()='No Search Results For']",
    openSearchDefinition: null,
    domain: 'bedbathbeyond.us',
    zipcode: '',
  },
};
