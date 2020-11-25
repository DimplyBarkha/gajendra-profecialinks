
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    domain: 'mediamarkt.ch',
    loadedSelector: '#product-details',
    noResultsXPath: '//div[contains(@id, "search_no_result")] | //h1[contains(text(), "404")] | //div[contains(@class, "outer-brand")] | //span[@class="offline-text"]',
    zipcode: '',
  },
};
