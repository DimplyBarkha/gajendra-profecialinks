
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    nextLinkSelector: 'div[data-testid="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector : 'div[data-uid="mbaline2"]',
    noResultsXPath: '//div[@id="fragment-search"]//div[contains(text(),"haben wir leider kein Suchergebnis gefunden")]',
    openSearchDefinition: null,
    domain: 'ottoversand.at',
    zipcode: '',
  },
};
