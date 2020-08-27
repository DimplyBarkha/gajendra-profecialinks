
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    domain: 'laredoute.fr',
    url: 'https://www.laredoute.fr/psrch/psrch.aspx?kwrd={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
