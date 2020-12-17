
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    domain: 'ao.de',
    loadedSelector: 'section.productInformation, div#container',
    noResultsXPath: '//h1[contains(text(), "Diese Seite existiert leider nicht") or contains(text(), "Oh nein – Wir konnten leider nichts zu")]',
    zipcode: '',
  },
};
