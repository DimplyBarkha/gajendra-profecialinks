
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    domain: 'douglas.de',
    url: 'https://www.douglas.de/search.html?query={searchTerms}',
    loadedSelector: 'div.rd__product-list',
    noResultsXPath: '//h3',
  },
};
