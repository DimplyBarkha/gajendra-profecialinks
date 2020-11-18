
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'kifli',
    domain: 'kifli.hu',
    url: 'https://kifli.hu/en/kereses/{searchTerms}?companyId=1',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
