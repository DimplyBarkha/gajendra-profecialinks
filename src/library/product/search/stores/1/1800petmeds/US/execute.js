
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: '1800petmeds',
    domain: '1800petmeds.com',
    url: 'https://www.1800petmeds.com/search/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
