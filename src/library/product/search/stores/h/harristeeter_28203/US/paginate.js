
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28203',
    nextLinkSelector: null, // 'div.pagination-bar a.next-arrow',
    mutationSelector: null,
    spinnerSelector: null, // '#loader-div',
    loadedSelector: null, // 'div.search-results.section-products.grid-view',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'harristeeter.com',
    zipcode: '',
  },
};
