
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    nextLinkSelector: 'div[class="plpProductNaviation"] button[class="pageDirect"] img[class="btnRight"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img[class="productTileImage"]',
    noResultsXPath: '//div[@class="empty-search"]',
    openSearchDefinition: null,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
};
