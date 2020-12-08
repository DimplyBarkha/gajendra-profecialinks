
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BR',
    store: 'drogariaSaoPaulo',
    loadedSelector: 'div.container-prateleira div.resultItemsWrapper div.chaordic-search-list ul li',
    noResultsXPath: '//div[contains(@class, "rnk-componente-title")]//h1[contains(., "Nenhum Resultado Encontrado")]',
    openSearchDefinition: null,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  },
};
