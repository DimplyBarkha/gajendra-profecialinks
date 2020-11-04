module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    domain: 'submarino.com.br',
    loadedSelector: 'div[class*=\'product-main-area\']',
    noResultsXPath: '//div[contains(@class, \'EmptyPage__Container\')] | //link[@rel=\'canonical\']/@href[not(contains(., \'produto\'))]',
    zipcode: '',
  },
};
