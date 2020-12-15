
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'carrefour',
    nextLinkSelector: '.text-center > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.wrapper-image > img',
    noResultsXPath: '//div[@class="container"]//h1',
    openSearchDefinition: null,
    domain: 'carrefour.it',
    zipcode: '',
  },
};
