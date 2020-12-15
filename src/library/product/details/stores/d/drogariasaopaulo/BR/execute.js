
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'drogariasaopaulo',
    domain: 'drogariasaopaulo.com.br',
    url: 'https://www.drogariasaopaulo.com.br/{id}/p',
    loadedSelector: 'main#inicio-conteudo',
    noResultsXPath: null,
    zipcode: '',
  },
};
