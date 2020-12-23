
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'mathem',
    domain: 'mathem.se',
    url: 'https://www.mathem.se/sok?q={searchTerms}&page=1&pageSize=25&type=p',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
