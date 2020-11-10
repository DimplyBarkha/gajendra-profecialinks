
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'macro',
    nextLinkSelector: 'nav.my-0 li a[title^="Dal"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main[class^="mo-container"]',
    noResultsXPath: '//span[@class="alert-description" and text()="Hledaným parametrům nevyhovuje žádné zboží. "]',
    openSearchDefinition: null,
    domain: 'macro.cz',
    zipcode: '',
  },
};
