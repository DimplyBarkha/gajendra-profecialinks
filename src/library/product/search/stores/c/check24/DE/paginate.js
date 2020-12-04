
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    nextLinkSelector: 'button.btn-next',
    mutationSelector: null,
    spinnerSelector: 'div.overlay-spinner',
    loadedSelector: 'img.grid-product__image',
    noResultsXPath: '//div[@class="fakeresult_headline"]',
    openSearchDefinition: null,
    domain: 'check24.de',
    zipcode: '',
  },
};