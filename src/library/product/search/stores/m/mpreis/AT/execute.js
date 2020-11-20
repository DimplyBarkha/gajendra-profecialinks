
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    domain: 'mpreis.at',
    url: 'https://www.mpreis.at/search/{searchTerms}',
    loadedSelector: 'div.c3-product-grid__body',
    noResultsXPath: '//div[@class="c3-product-grid__no-items"]',
    zipcode: '',
  },
};
