
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    domain: 'voila.ca',
    loadedSelector: 'h1',
    noResultsXPath: '//span[contains(text(),"We could")] | //h1[contains(text(),"Page not found")]',
  },
};
