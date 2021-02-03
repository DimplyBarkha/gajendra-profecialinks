
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    domain: 'canadiantire.ca',
    url: 'https://www.canadiantire.ca/en/search-results.html?q={searchTerms}',
    loadedSelector: 'div[data-component="ProductTileSrp"], div.pdp-product-image-and-buy-box__inner.general-product',
    noResultsXPath: '//span[@class="g-s-no-results__top-message-heading-text"]',
    zipcode: '',
  },
};
