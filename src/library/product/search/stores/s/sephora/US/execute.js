
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    domain: 'sephora.com',
    url: 'https://www.sephora.com/search?keyword={searchTerms}&pageSize=150',
    loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    // noResultsXPath: '//div[contains(@data-comp, "NoSearchResults")]',
    zipcode: '',
  },
};