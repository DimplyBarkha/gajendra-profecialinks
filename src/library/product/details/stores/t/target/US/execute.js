module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    loadedSelector: 'body',
    noResultsXPath: '//h1[contains(.,"no results found")]',
  },
};
