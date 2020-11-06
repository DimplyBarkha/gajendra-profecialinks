
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    domain: 'coopvitality.ch',
    url: 'https://www.coopvitality.ch/de/catalogsearch/result/index?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
