
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    domain: 'rakuten.de',
    url: 'https://www.rakuten.de/suchen/"{searchTerms}"',
    loadedSelector: 'div.vw-searchProductList',
    noResultsXPath: '//h1[@class="search-title"]/span[@class="message"][2]',
    zipcode: '',
  },
};
