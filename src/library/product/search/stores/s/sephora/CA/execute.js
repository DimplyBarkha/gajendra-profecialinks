module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/ca/en/api/catalog/search?type=keyword&q={searchTerms}&content=true&includeRegionsMap=true&page=50&currentPage=1',
    // loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    // noResultsXPath: '//div[contains(@data-comp, "NoSearchResults")]',
    zipcode: '',
  },
};
