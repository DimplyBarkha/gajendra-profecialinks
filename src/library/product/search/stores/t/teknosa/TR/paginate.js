
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    nextLinkSelector: 'div[class="pagination-bar bottom"] ul[class="pagination"] > li[class="pagination-next"]>a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="js-product-list-grid-view"]',
    noResultsXPath: '//div[@class="alert-box alert-information"]//div[@class="text"]',
    openSearchDefinition: null,
    domain: 'teknosa.com',
    zipcode: '',
  },
};