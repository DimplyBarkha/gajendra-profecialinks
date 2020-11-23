
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28277',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.harristeeter.com/shop/store/66/search/{searchTerms}?pageNo={page}',
    },
    domain: 'harristeeter.com',
    zipcode: '',
  },
};
