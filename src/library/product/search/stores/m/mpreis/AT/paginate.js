
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'mpreis',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.c3-product-grid__body',
    noResultsXPath: '//div[@class="c3-product-grid__no-items"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mpreis.at',
    zipcode: '',
  },
};
