
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
    openSearchDefinition: null,
    domain: 'netshoes.com.br',
    zipcode: "''",
  },
};
