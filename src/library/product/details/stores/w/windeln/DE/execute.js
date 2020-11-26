
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    domain: 'windeln.de',
    loadedSelector: 'body[id="pageId-product"]',
    noResultsXPath: '//div[@class="main-wrapper"][contains(., "die Seite konnte leider nicht gefunden werden")]',
    zipcode: '',
  },
};
