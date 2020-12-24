
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-box-name,"Non existing offer")] | //p[contains(.,"Czy na pewno szukasz")]',
    zipcode: '',
  },
};
