
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'us',
    store: 'instacart_wegmans',
    domain: 'instacart.com',
    url: 'https://instacart.wegmans.com/store/wegmans/search_v3/{searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
