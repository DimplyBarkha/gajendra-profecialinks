module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    url: 'https://www.mediaworld.it/search/{searchTerms}',
    loadedSelector: 'div.main-content.is-search-page',
    noResultsXPath: '//div[@class="search-product-widget search-empty"]',
    zipcode: '',
  },
};
