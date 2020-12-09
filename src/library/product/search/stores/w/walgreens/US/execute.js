
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    domain: 'walgreens.com',
    url: 'https://www.walgreens.com/search/results.jsp?Ntt={searchTerms}&Erp=72',
    loadedSelector: 'div.card__product',
    noResultsXPath: '//h1[contains(.,"have any matches")]',
  },
};
