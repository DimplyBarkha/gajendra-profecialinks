
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'azrieli',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"homePageTop")] | //div[contains(@class,"notFoundMsg")]',
    openSearchDefinition: null,
    domain: 'azrieli.com',
    zipcode: '',
  },
};
