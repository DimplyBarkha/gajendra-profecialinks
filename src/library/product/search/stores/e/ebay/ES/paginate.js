
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    nextLinkSelector: 'td[class="next"]>a[class="enabled"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td#CentralArea',
    noResultsXPath: 'div[contains(@class,"trc")]//span[@class="cnt"][text()=0]',
    openSearchDefinition: null,
    domain: 'ebay.es',
    zipcode: '',
  },
};
