
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FI',
    store: 'cocopanda',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#main-container',
    noResultsXPath: '//main[@id="main-container"]//div[@class="main-content"]/h1[contains(text(),"Valitettavasti haulla")]',
    openSearchDefinition: null,
    domain: 'cocopanda.fi',
    zipcode: '',
  },
};
