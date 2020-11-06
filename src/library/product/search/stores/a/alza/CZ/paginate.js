
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    nextLinkSelector: '.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '[class="bi js-block-image"]',
    noResultsXPath: '//div[@id="noresult"]',
    openSearchDefinition: null,
    domain: 'alza.cz',
    zipcode: '',
  },
};
