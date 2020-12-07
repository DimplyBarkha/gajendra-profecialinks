
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'dyson',
    domain: 'fi.dyson.com',
    loadedSelector: 'div.product-hero',
    noResultsXPath: '//h3[text()="Olemme pahoillamme, mutta etsimääsi sivua ei löydy."]',
    zipcode: '',
  },
};
