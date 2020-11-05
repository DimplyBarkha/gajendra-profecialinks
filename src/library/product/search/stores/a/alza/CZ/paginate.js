
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    nextLinkSelector: '.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@id="noresult"]',
    openSearchDefinition: null,
    domain: 'alza.cz',
    zipcode: '',
  },
};
