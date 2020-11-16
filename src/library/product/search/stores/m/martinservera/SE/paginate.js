
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    nextLinkSelector: 'div[id="product-list-wrapper"] > div > div[class="pagination is-loaded"] > ul > div[class="pagination-list-item next"] > a ',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product-list row"]',
    noResultsXPath: '//p[@class="no-result-header"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'martinservera.se',
    zipcode: '',
  },
};
