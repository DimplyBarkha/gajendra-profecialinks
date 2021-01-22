
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'iciparisxl_fr',
    nextLinkSelector: 'li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.product-grid',
    noResultsXPath: '//div[contains(@class,"pagination-sort top")]//div[@class="pagination"]//li[@class="next"]//a[contains(@class,"disabled button")]',
    openSearchDefinition: null,
    domain: 'iciparisxl_fr.be',
    zipcode: "''",
  },
};
