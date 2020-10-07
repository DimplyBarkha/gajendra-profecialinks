
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    nextLinkSelector: 'td[class="next"]>a[class="enabled"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="rs-pview"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'ebay.es',
    zipcode: '',
  },
};
