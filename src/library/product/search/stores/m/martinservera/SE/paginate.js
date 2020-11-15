
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    nextLinkSelector: 'div.pagination-list-item.next a',
    mutationSelector: 'div#product-list-wrapper div',
    spinnerSelector: null,
    loadedSelector: 'div.product-list DIV.product-tile',
    noResultsXPath: '//p[@class="no-result-header"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'martinservera.se',
    zipcode: '',
  },
};
