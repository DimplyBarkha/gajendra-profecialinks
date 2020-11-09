
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    nextLinkSelector: "ul > li > button[aria-label='Next']",
    mutationSelector: null,
    spinnerSelector: 'div.b-loader',
    loadedXPath: '//div[contains(@class,"row-cols")]/div[@class="col"]',
    noResultsXPath: '//div[@class="search-no-result"]',
    openSearchDefinition: null,
    domain: 'aceuae.com',
    zipcode: '',
  },
};
