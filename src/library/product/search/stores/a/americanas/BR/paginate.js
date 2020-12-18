
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*=StyledGrid] div[class*=GridItem]',
    noResultsXPath: '//div[contains(@class,"src__Container")]//span[contains(@class,"src__Text")][contains(text(),"Ops!")]',
    openSearchDefinition: {
      template: 'https://www.americanas.com.br/busca/{searchTerms}?limit=24&offset={offset}',
    },
    domain: 'americanas.com.br',
    zipcode: '',
  },
};
