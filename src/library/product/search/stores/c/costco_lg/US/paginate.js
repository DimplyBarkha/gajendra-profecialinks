module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco_lg',
    nextLinkSelector: 'div.paging ul li.forward>a',
    loadedXPath: '//div[contains(@class,"product-tile-set")]//div[@class="price"]/@id',
    domain: 'costco.com',
  },
};
