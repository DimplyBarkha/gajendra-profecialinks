
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    domain: 'emaxme.com',
    url: 'https://www.emaxme.com/s001/catalogsearch/result/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
