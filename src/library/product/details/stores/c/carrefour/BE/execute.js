
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    domain: 'carrefour.eu',
    noResultsXPath: '//h2[contains(.,"0 résultats correspondants à")]',
    zipcode: '',
  },
};
