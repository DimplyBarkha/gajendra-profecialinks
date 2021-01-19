
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    domain: 'zonasul.com.br',
    url: 'https://www.zonasul.com.br/busca/{searchTerms}',
    loadedSelector: 'div.vtex-flex-layout-0-x-flexRow--productListDesktop',
    noResultsXPath: '//h2[contains(text(),"Desculpe, não encontramos nenhum resultado para")]',
    zipcode: "''",
  },
};
