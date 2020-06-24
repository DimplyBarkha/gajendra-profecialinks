
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'div.paging ul li.forward>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedXPath: '//div[contains(@class,"product-tile-set")]//div[@class="price"]/@id',
    openSearchDefinition: null,
    domain: 'costco.com',
  },
};
