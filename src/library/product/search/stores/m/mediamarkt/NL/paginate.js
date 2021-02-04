
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    nextLinkSelector: '.pagination-next a',
    mutationSelector: null,
    spinnerSelector: 'div#loading .spinner',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
};
