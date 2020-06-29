module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'li.Pagination-item.Pagination-next:not(.is-disabled)> a',
    // openSearchDefinition: {
    //   template: 'https://www.kroger.com/pl/all/00?fulfillment=all&query={searchTerms}&page={page}&searchType=natural',
    // },
    openSearchDefinition: null,
    domain: 'kroger.com',
  },
};
