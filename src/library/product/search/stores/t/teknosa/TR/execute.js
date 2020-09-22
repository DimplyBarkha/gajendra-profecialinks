
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    domain: 'teknosa.com',
    url: 'https://www.teknosa.com/arama/?s={searchTerms}',
    loadedSelector: '#product-item > .product-item-inner .product-image-item img',
    noResultsXPath: '//title[contains(.,"No Results | Teknosa")]',
    zipcode: '',
  },
};
