
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    domain: 'instacart.com',
    url: 'https://www.instacart.com/store/publix/search_v3/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '32821',
  },
};
