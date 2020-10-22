
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    nextLinkSelector: 'div.preloader__spinner',
    mutationSelector: null,
    spinnerSelector: 'div.preloader__spinner',
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'whiteaway.com',
    zipcode: '',
  },
};
