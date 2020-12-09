
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    domain: 'easyparapharmacie.com',
    url: 'https://www.easyparapharmacie.com/catalogsearch/result/index/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
