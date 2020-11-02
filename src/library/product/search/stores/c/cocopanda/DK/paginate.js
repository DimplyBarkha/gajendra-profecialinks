module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'cocopanda',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#main-container',
    noResultsXPath: '//main[@id="main-container"]//div[@class="main-content"]/h1[contains(text(),"Vi fandt desværre ingen produkter, der matcher din søgning efter")]',
    openSearchDefinition: null,
    domain: 'cocopanda.dk',
    zipcode: '',
  },
};
