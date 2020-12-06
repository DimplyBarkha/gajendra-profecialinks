
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    domain: 'perfecthair.ch',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"detail-error content listing--content")]//*[contains(text(),"nicht mehr verfügbar")]',
    zipcode: '',
  },
};
