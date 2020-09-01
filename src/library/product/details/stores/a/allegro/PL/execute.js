module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    loadedSelector: 'div.main-wrapper',
    noResultsXPath: '//div[contains(@class, "opbox-sheet-wrapper")]//font[contains(text(),"The selected category was not what you were looking for.")]',
    zipcode: '',
  },
};
