
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"contentMessageContent") and contains(text(),"Das gewünschte Produkt ist nicht mehr verfügbar")]|//div[contains(@class,"alert-info") and contains(text(),"Die gesuchte Seite wurde leider nicht gefunden")]',
    zipcode: '',
  },
};
