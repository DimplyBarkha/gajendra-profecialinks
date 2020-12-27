
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    domain: 'hazesmokeshop.ca',
    url: 'https://hazesmokeshop.ca/?s={searchTerms}&post_type=product',
    loadedSelector: 'div.shop-loop-head',
    noResultsXPath: null,
    zipcode: '',
  },
};
