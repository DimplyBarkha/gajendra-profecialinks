module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    domain: 'americanas.com.br',
    loadedSelector: 'div[id="root"]',
    noResultsXPath: '//h1[contains(text(),"poooxa! não encontramos o seu produto!")]|//div[contains(@class,"src__Container")]//span[contains(@class,"src__Text")][contains(text(),"Ops!")]',
    zipcode: '',
  },
};
