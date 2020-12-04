
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    domain: 'emag.hu',
    url: 'https://www.emag.hu/search/{searchTerms}',
    loadedSelector: 'div[id="card_grid"]',
    noResultsXPath: '//span[text()="0 találat a következő kifejezésre:"]',
    zipcode: '',
  },
};
