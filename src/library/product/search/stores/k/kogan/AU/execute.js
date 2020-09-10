
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    domain: 'kogan.com',
    url: 'https://www.kogan.com/au/shop/?q={searchTerms}',
    loadedSelector: 'section._1rmYJ',
    noResultsXPath: null,
    zipcode: '',
  },
};
