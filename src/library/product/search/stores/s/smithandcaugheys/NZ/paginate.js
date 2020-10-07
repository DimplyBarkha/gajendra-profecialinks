
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(text(),"Sorry no results found")]',
    openSearchDefinition: null,
    domain: 'smithandcaugheys.co.nz',
    zipcode: '',
  },
};
