
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'dyson',
    domain: 'dyson.se',
    loadedSelector: 'div.product-hero.parbase',
    noResultsXPath: '//h3[contains(text(), "Tyvärr kunde vi inte hitta den sida du letar efter.")]',
    zipcode: '',
  },
};
