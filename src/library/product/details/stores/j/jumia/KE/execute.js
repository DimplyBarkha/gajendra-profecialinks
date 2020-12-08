module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    domain: 'jumia.co.ke',
    loadedSelector: 'main.-pvs',
    noResultsXPath: '//h2[contains(text(), "There are no results")]',
    zipcode: '',
  },
};
