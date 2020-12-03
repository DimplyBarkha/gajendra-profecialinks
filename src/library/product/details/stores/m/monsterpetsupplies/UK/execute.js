
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    domain: 'monsterpetsupplies.co.uk',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: '//h1[contains(text(), "No results for")]',
    zipcode: '',
  },
};
