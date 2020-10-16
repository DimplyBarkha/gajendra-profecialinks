
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    domain: 'vitalsana.com',
    url: 'https://www.vitalsana.com/catalogsearch/result/?q=prosta',
    loadedSelector: '#maincontent',
    noResultsXPath: null,
    zipcode: '',
  },
};
