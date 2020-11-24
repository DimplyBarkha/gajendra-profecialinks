
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    domain: 'nordstrom.com',
    loadedSelector: 'div#root',
    noResultsXPath: '//h1[contains(.,"No results for")] | //h1[contains(.,"trying to reach cannot be found.")]',
  },
};
