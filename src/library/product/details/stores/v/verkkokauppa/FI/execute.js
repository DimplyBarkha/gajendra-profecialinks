
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    loadedSelector: 'html',
    noResultsXPath: '//main[@id="main"]',
    zipcode: '',
  },
};
