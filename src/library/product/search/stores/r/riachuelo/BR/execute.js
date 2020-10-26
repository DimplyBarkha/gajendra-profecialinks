
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'riachuelo',
    domain: 'riachuelo.com.br',
    url: 'https://www.riachuelo.com.br/?q={searchTerms}',
    loadedSelector: 'ol>li.product-list__item',
    noResultsXPath: '//p[@class="product-list__warning"]',
    zipcode: '',
  },
};
