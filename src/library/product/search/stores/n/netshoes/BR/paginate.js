
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    nextLinkSelector: 'a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.search-list',
    noResultsXPath: '//div[contains(@class, "no-results")]//h2[contains(text(), "Não foi possível encontrar resultados para o termo procurado")]',
    openSearchDefinition: null,
    domain: 'netshoes.com.br',
    zipcode: "''",
  },
};
