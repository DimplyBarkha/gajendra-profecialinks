
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    domain: 'coolblue.be',
    loadedSelector: '#main-content',
    noResultsXPath: '//*[contains(text(), "Je bent naar een pagina geleid die niet bestaat")] | //body[count(//main[contains(@class, "product-page")])=0]',
    zipcode: '',
  },
};
