
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'roge',
    domain: 'roge.com.br',
    url: 'https://www.roge.com.br/search?q={searchTerms}',
    loadedSelector: 'div[id="product-listing-container"]',
    noResultsXPath: '//div[@class="no-result"]',
    zipcode: '',
  },
};
