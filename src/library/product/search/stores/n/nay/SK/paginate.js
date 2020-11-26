
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    nextLinkSelector: '#col-content > div.par > div > div > a > span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'nay.sk',
    zipcode: '',
  },
};
