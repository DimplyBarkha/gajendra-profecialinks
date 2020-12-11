
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'kmart',
    nextLinkSelector: 'a[class="right_arrow"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product_listing_container product_listing_container_new apparel-right"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kmart.com.au',
    zipcode: '',
  },
};