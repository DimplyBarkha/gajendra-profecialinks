
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'drogaraia',
    domain: 'drogaraia.com.br',
    url: 'https://busca.drogaraia.com.br/search?w={searchTerms}',
    loadedSelector: 'div h2',
    noResultsXPath: '//div[contains(@class, "noresults")]',
    zipcode: '',
  },
};
