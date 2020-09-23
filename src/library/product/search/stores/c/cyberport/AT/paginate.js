
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    nextLinkSelector: 'a.nextLink',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'body',
    loadedSelector: 'div.productsList',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'cyberport.at',
    zipcode: '',
  },
};
