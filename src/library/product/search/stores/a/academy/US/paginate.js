
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'academy',
    nextLinkSelector: 'div[data-auid="listingPagination"] ul li:last-child:not(.css-10lvqgw)',
    // nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   offset: 30,
    //   template: 'https://www.academy.com/shop/browse/search?searchTerm={searchTerms}&beginIndex={offset}',
    // },
    domain: 'academy.com',
    zipcode: '',
  },
};
