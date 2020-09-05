
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    domain: 'coolblue.be',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    zipcode: '',
  },
};
