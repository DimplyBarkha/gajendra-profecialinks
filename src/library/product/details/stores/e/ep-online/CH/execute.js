
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'ep-online',
    domain: 'ep-online.ch',
    loadedSelector: 'div[id="main-section"]',
    noResultsXPath: '//*[@class="not-found-headline"]',
    zipcode: '',
  },
};
