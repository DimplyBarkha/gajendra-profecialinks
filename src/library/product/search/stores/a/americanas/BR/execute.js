
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    domain: 'americanas.com.br',
    url: 'https://www.americanas.com.br/busca/{searchTerms}',
    loadedSelector: 'div[class*=StyledGrid]',
    noResultsXPath: '//div[contains(@class,"src__Container")]//span[contains(@class,"src__Text")][contains(text(),"Ops!")]',
    zipcode: '',
  },
};
