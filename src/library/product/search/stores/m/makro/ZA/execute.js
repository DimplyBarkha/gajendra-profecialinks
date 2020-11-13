
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'makro',
    domain: 'makro.za',
    url: 'https://www.makro.co.za/search/?text={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
