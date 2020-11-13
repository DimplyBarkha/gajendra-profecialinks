
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    nextLinkSelector: 'li[class="page-item page-item--navigation "] a[id="paginationPageNext"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol[id="productList"]',
    noResultsXPath: '//div[@id="searchEmpty"] | //div[@class="product"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'vikingdirect.nl',
    zipcode: '',
  },
};
