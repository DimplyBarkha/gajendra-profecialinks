module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    nextLinkSelector:
      'div.pagination.bottom-paging a.ignore-hidden-toggle.pagination-next span.icon-arrow-right, button.btn.btn--secondary.btn--big.pagination__btn-next:not([disabled])',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-list.clearfix',
    noResultsXPath: '//h2[@class="fsearchnoresults__header"] | //a[@class="btn btn--secondary text-left"]',
    openSearchDefinition: null,
    domain: 'boozt.com',
    zipcode: '',
  },
};
