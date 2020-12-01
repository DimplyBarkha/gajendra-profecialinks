
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'bueroshop24',
    nextLinkSelector: 'div.pagination a[rel="next"]:not(.inactive)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//main//div[@class="error-container"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bueroshop24.de',
    zipcode: '',
  },
};
