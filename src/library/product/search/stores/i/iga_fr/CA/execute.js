
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'iga_fr',
    domain: 'iga.net/fr',
    url: 'https://www.iga.net/fr/search',
    loadedSelector: 'body',
    noResultsXPath: 'body',
    zipcode: '',
  },
};
