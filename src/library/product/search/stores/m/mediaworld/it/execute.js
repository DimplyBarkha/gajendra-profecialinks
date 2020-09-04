module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'it',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    url: 'https://www.mediaworld.it/search/{searchTerms}',
    loadedSelector: 'div.main-content.is-search-page',
    //loadedSelector: null,
    noResultsXPath: '//div[@class="search-product-widget search-empty"]',
    //noResultsXPath: null,
    zipcode: '',
  },
};
