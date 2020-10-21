
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    loadedSelector: 'div[class*=\'product-main-area\']',
    noResultsXPath: null,
  },
};
