
module.exports = {
  implements: 'product/reviews/paginate',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    nextLinkSelector: '//li[@class="bv-content-pagination-buttons-item bv-content-pagination-buttons-item-next"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kroger.com',
    zipcode: '',
  },
};
