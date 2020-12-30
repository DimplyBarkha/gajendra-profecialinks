
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-box-name,"Non existing offer")] | //p[contains(.,"Czy na pewno szukasz")] | //p[contains(.,"Teraz nie możemy znaleźć")] | //h3[contains(.,"Oferta została zakończona")]',
    zipcode: '',
  },
};
