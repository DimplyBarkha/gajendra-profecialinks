
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    nextLinkSelector: 'div[class="plpProductNaviation"] button[class="pageDirect"] img[class="btnRight"],div[class="plp-bottom-navigation"] div[class="pagination-nav"] a[class~="icon-chevron-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="plp-product-tiles"] li > a[class="product-img"]',
    noResultsXPath: '//div[@class="empty-search"]',
    openSearchDefinition: null,
    domain: 'shoppersdrugmart.ca',
    zipcode: '',
  },
};
