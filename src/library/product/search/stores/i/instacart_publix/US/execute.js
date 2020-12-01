
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    domain: 'instacart.com',
    url: 'https://www.instacart.com/store/publix/search_v3/{searchTerms}',
    loadedSelector: '#react-views-container > div > div > div > div:nth-child(1) > div > div > div',
    noResultsXPath: null,
    zipcode: '',
  },
};
