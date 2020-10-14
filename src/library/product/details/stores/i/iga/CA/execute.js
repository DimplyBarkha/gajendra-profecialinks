
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    domain: 'iga.net',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"Page not found")]/parent::div',
    zipcode: '',
  },
};
