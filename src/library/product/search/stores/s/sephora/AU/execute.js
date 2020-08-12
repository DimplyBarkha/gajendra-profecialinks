
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    domain: 'sephora.com.au',
    url: 'https://www.sephora.com.au/search?q={searchTerms}&view=120',
    loadedSelector: ['div[data-comp="ProductGrid "] a','div[data-at="product_tabs_section"]'],
    noResultsXPath: null,
    zipcode: '',
  },
};
