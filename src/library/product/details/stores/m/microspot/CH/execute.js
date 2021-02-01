
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    domain: 'microspot.ch',
    // loadedSelector: 'div#TOP_CONTENT_ANCHOR',
    loadedSelector: 'div#container-productdetailPrice',
    // noResultsXPath: '//h2[contains(text(),"Dieses Produkt ist leider nicht mehr verfügba")]|//*[contains(text(),"Aber so schnell geben Sie doch nicht auf, ode")]',
    noResultsXPath: '//h2[contains(text(),"Dieses Produkt ist leider nicht mehr verfügba")] | //*[contains(text(),"Aber so schnell geben Sie doch nicht auf, ode")] | //div[@id="container-productlist"]//a[contains(@id, "container-product-0-item")]',
    zipcode: '',
  },
};
