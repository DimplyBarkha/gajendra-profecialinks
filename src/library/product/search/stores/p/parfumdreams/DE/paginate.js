
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    nextLinkSelector: '#right-column div div:nth-child(10) form a div',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
};