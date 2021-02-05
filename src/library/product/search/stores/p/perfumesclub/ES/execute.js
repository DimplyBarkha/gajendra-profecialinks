
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'perfumesclub',
    domain: 'perfumesclub.com',
    url: 'https://www.perfumesclub.com/es/{searchTerms}/buscar',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
