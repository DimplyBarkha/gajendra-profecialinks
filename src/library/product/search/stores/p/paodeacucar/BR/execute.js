
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    domain: 'paodeacucar.com',
    url: 'https://www.paodeacucar.com/busca?w={searchTerms}',
    loadedSelector: 'div[class*="MuiGrid-spacing-xs-2"]',
    noResultsXPath: '//p[contains(text(), "nfelizmente não encontramos nenhum produto")]|//p[contains(text(), "Produto não encontrado.")]|//p[contains(text(), "Você quis dizer")]',
    zipcode: '',
  },
};
