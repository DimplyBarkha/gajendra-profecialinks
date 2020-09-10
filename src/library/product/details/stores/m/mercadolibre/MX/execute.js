
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    domain: 'mercadolibre.com.mx',
    loadedSelector: 'div.vip-nav-bounds div.layout-main, div.ui-pdp-container--pdp',
    noResultsXPath: '//main[@class="ui-pdp-not-found"] | //*[@class="ui-empty-state__title"][text()="Parece que esta página no existe"] | //div[@class="vip-error-screen not-found"]/*[@class="error-title"]',
    zipcode: '',
  },
};
