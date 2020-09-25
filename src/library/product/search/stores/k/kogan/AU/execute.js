
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    domain: 'kogan.com',
    url: 'https://www.kogan.com/au/shop/?q={searchTerms}',
    loadedSelector: 'section._3a_UN',
    noResultsXPath: '//div[contains(@class,"yFdVB")]',
    zipcode: '',
  },
};
