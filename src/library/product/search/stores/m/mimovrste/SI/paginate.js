
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.mimovrste.com/iskanje?page={page}&s={searchTerms}',
    },
    domain: 'mimovrste.com',
    zipcode: '',
  },
};
