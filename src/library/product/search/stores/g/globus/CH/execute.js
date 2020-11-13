
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'globus',
    domain: 'globus.ch',
    url: "https://www.globus.ch/suche?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
