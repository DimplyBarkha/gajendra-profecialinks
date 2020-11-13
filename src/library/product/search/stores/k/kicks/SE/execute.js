
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'kicks',
    domain: 'kicks.se',
    url: 'https://www.kicks.se/sok?q=blush',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
