
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'cocopanda',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#main-container',
    noResultsXPath: '//main[@id="main-container"]//div[@class="main-content"]/h1[contains(text(),"Vi hittade tyvärr inga produkter som matchar din sökning efter")]',
    openSearchDefinition: null,
    domain: 'cocopanda.se',
    zipcode: '',
  },
};
