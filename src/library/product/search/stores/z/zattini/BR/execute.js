
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'zattini',
    domain: 'zattini.com.br',
    url: 'https://www.zattini.com.br/busca?nsCat=Natural&q=body+spray&searchTermCapitalized=Body+Spray',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
