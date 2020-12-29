
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'nordstrom',
    domain: 'nordstrom.ca',
    loadedSelector: 'div#root',
    noResultsXPath: '//h1[contains(.,"cannot be found")]',
  },
};
