
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount_fr',
    domain: 'interdiscount.ch',
    loadedSelector: 'div[class~="demoup-container"] img',
    noResultsXPath: '//h1[contains(text(),"Seite nicht gefunden (404)")] | //*[contains(text(),"Dieses Produkt ist leider nicht mehr verfügbar")]',
    zipcode: '',
  },
};
