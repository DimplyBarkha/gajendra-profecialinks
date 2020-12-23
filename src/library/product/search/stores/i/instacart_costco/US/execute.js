
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'instacart_costco',
    domain: 'instacart.com',
    url: 'https://www.instacart.com/store/costco/search_v3/Keywords={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
