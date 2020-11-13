
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    nextLinkSelector: 'li[class="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="results"]',
    noResultsXPath: '//div[@class="no-results"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'pnp.co.za',
    zipcode: '',
  },
};
