
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'hondoscenter',
    domain: 'hondoscenter.com',
    url: 'https://www.hondoscenter.com/el/apotelesmata-proionton/?search-for={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
