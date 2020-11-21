
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    domain: 'viking.de',
    url: 'https://www.viking.de/de/search/?text={searchTerms}',
    loadedSelector: 'main#siteContent',
    noResultsXPath: null,
    zipcode: '',
  },
};
