
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    nextLinkSelector: 'span[class*="navPage-right"] a[class="searchInputMode"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="productListe"]',
    noResultsXPath: '//*[@class="noresultTitle"]',
    openSearchDefinition: null,
    domain: 'boulanger.com',
    zipcode: '',
  },
};
