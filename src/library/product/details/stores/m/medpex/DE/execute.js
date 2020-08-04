
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    domain: 'medpex.de',
    loadedSelector: '//div[id="product-list"]',
    noResultsXPath: '//td[text()="Wichtige Nachricht"]',
    zipcode: '',
  },
};
