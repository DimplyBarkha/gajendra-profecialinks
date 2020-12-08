
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="x-page-content container_3Sp8P"] main',
    noResultsXPath: 'div[class="productList_31W-E"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
