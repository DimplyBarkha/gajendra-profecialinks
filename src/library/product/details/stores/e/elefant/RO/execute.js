
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RO',
    store: 'elefant',
    domain: 'elefant.ro',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"errorpage-cta")]//h3[text()="Ne pare rau, pagina nu a fost gasita!"]',
    zipcode: '',
  },
};
