
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    domain: 'mytime.de',
    loadedSelector: '.product-page',
    noResultsXPath: '//picture[@data-alt="Wechsler-Fehlserseite"]',
    zipcode: '',
  },
};
