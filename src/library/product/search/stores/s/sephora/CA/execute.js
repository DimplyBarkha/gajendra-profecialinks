
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    domain: 'sephora.ca',
    url: 'https://www.sephora.com/search?keyword={searchTerms}&pageSize=150',
    loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    noResultsXPath: null,
    zipcode: '',
  },
};
