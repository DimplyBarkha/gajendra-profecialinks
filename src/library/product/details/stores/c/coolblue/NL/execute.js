
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    zipcode: '',
  },
};
