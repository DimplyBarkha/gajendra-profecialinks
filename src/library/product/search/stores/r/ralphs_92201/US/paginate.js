
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'ralphs_92201',
    loadedSelector: '.PaginateItems',
    nextLinkSelector: 'button.kds-Button.kds-Button--primaryInverse.kds-Button--compact.kds-Button--hasIconOnly.kds-Pagination-next',
    openSearchDefinition: null,
    domain: 'ralphs.com',
    zipcode: '',
  },
};
