
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    domain: 'vitalsana.com',
    url: 'https://www.vitalsana.com/catalogsearch/result/?q=Blasenschw%C3%83%C2%A4che',
    loadedSelector: '#maincontent',
    noResultsXPath: null,
    zipcode: '',
  },
};
