
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    nextLinkSelector: 'button.btn-next',
    mutationSelector: null,
    spinnerSelector: 'div.overlay-spinner',
    loadedSelector: 'div.srp-row.products-grid div.grid-product',
    noResultsXPath: '//div[@class="fakeresult_headline"]//font//font',
    openSearchDefinition: null,
    domain: 'check24.de',
    zipcode: '',
  },
};