
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    domain: 'microspot.ch',
    loadedSelector: 'div#TOP_CONTENT_ANCHOR',
    noResultsXPath: '//h2[contains(text(),"Dieses Produkt ist leider nicht mehr verfügba")] | //*[contains(text(),"Aber so schnell geben Sie doch nicht auf, ode")]',
    zipcode: '',
  },
};
