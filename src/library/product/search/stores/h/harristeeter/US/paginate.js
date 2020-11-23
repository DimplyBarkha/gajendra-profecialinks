
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'harristeeter',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.harristeeter.com/shop/store/412/search/{searchTerms}?pageNo={page}',
    },
    domain: 'harristeeter.com',
    zipcode: '',
  },
};
