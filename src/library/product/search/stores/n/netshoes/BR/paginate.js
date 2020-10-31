
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'netshoes',
    nextLinkSelector: 'a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"no-results")]//h2',
    openSearchDefinition: {
      template: 'https://www.netshoes.com.br/busca?q={searchTerms}&page={page}',
    },
    domain: 'netshoes.com.br',
    zipcode: "''",
  },
};
