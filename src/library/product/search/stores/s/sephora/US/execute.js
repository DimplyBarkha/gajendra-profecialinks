module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/api/catalog/search?type=keyword&q={searchTerms}&content=true&includeRegionsMap=true&page=50&currentPage=1',
    // loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    // noResultsXPath: '//div[contains(@data-comp, "NoSearchResults")]',
    zipcode: '',
  },
};