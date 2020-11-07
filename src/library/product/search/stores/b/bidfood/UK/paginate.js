
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'bidfood',
    nextLinkSelector: 'a.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#main div.container',
    noResultsXPath: '//main[@id="main"]/div[@class="container"]//h3[text()="Sorry no results were found."]',
    openSearchDefinition: null,
    domain: 'bidfood.co.uk',
    zipcode: '',
  },
};
