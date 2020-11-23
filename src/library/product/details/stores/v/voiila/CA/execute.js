
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'voiila',
    domain: 'voila.ca',
    loadedSelector: 'h1',
    noResultsXPath: '//span[contains(text(),"We could")]',
  },
};
