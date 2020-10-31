
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'ralphs_92201',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'button.kds-Button.kds-Button--primaryInverse.kds-Button--compact.kds-Button--hasIconOnly.kds-Pagination-next:not(:disabled)',
    // openSearchDefinition: {
    //   template: 'https://www.ralphs.com/search?query={searchTerms}&searchType=default_search&fulfillment=all&page={page}',
    // },
    domain: 'ralphs.com',
    zipcode: '',
  },
};
