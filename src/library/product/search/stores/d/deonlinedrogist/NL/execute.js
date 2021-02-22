
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'deonlinedrogist',
    domain: 'deonlinedrogist.nl',
    url: 'https://www.deonlinedrogist.nl/search/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
