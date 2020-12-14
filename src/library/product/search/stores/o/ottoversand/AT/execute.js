
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    domain: 'ottoversand.at',
    url: 'https://www.ottoversand.at/s/{searchTerms}/',
    loadedSelector : 'div[data-uid="mbaline2"]',
    noResultsXPath: '//div[@id="fragment-search"]//div[contains(text(),"haben wir leider kein Suchergebnis gefunden")]',
    zipcode: '',
  },
};
