
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'academy',
<<<<<<< HEAD
    nextLinkSelector: null,
    //'div[data-auid="listingPagination"] ul li:last-child:not(.css-10lvqgw)',
    // nextLinkSelector: '[data-auid="listingPagination"] li:last-child a',
=======
    nextLinkSelector: 'div[data-auid="listingPagination"] ul li:last-child:not(.css-10lvqgw)',
    // nextLinkSelector: null,
>>>>>>> 0c8bc30c7c70a1c79ea4fc39b11de2a659b1cbd7
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
<<<<<<< HEAD
    openSearchDefinition: {
      template: 'https://www.academy.com/shop/browse/everyday?searchterm={searchTerms}',
    },
=======
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   offset: 30,
    //   template: 'https://www.academy.com/shop/browse/search?searchTerm={searchTerms}&beginIndex={offset}',
    // },
>>>>>>> 0c8bc30c7c70a1c79ea4fc39b11de2a659b1cbd7
    domain: 'academy.com',
    zipcode: '',
  },
};
