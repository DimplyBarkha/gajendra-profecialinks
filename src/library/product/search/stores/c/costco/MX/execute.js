
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    domain: 'costco.com.mx',
    url: 'https://www.costco.com.mx/search?text={searchTerms}',
    loadedSelector: '#list-view-id > li > .product-image > a.thumb > img',
    noResultsXPath: '//span[contains(.,"No se encontraron resultados para")]',
    zipcode: '',
  },
};
