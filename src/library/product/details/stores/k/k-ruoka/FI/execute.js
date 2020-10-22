
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    domain: 'k-ruoka.fi',
    loadedSelector: 'section#shopping-basket-element',
    noResultsXPath: '//span[contains(text(),"vastaavia tuotteita ei löytynyt")]',
    zipcode: '',
  },
};
