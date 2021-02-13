
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'ralphs_92201',
    loadedSelector: '.PaginateItems', //'div.PaginateItems div.kds-Card', //''.PaginateItems',
    nextLinkSelector: 'button.kds-Button.kds-Button--tertiary.kds-Button--compact.kds-Button--hasIconOnly.kds-Pagination-next:not(:disabled)',
    // openSearchDefinition: {
    //   template: 'https://www.ralphs.com/search?query={searchTerms}&searchType=default_search&fulfillment=all&page={page}',
    // },
    noResultsXPath: '//p[@class="no-query-results heading-l font-medium mt-0"]',
    domain: 'ralphs.com',
    zipcode: '',
  },
};
