
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'monsterpetsupplies',
    domain: 'monsterpetsupplies.co.uk',
    url: 'https://www.monsterpetsupplies.co.uk/search/{searchTerms}',
    loadedSelector: 'div[class="product-list"]',
    noResultsXPath: '//h1[contains(text(), "No results for")]',
    zipcode: '',
  },
};
