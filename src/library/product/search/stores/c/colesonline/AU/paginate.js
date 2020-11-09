
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'colesonline',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://shop.coles.com.au/a/national/everything/search/{searchTerms}?pageNumber={page}',
    },
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
};
