
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'deliveryExtra',
    domain: 'clubeextra.com.br',
    url: 'https://www.clubeextra.com.br/busca?w={searchTerms}&qt=150&p=1&gt=grid',
    loadedSelector: "div[class*='MuiGrid-container MuiGrid-spacing-xs-2'] div[class*='product-cardstyles__Container']",
    noResultsXPath: "//p[contains(.,'nfelizmente não encontramos nenhum produto como esse por aqui, aconselhamos a tentar novamente ou procurar em outra modalidade.')]",
    zipcode: '',
  },
};
