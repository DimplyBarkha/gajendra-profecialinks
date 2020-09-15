
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    nextLinkSelector: 'ul.pagination li.page-item a i.icon-arrow_right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'liverpool.com.mx',
    zipcode: '',
  },
};
