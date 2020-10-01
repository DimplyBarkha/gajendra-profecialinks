
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GB',
    store: 'very',
    nextLinkSelector: 'a.paginationNext',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.productList',
    noResultsXPath: '//strong[contains(text(), "Oops, we didn")]',
    openSearchDefinition: null,
    domain: 'very.co.uk',
    zipcode: '',
  },
};
