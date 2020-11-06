
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    domain: 'apotekhjartat.se',
    url: 'https://www.apotekhjartat.se/soksida/?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//p[contains(@class,"noSearchResultText")]',
    zipcode: '',
  },
};
