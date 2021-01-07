
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    domain: 'worten.pt',
    loadedSelector: 'div#maincontent',
    noResultsXPath: '//h3[contains(text(),"Não conseguimos encontrar o que procuras.")]',
  },
};