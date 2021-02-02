
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    domain: 'naszezoo.pl',
    loadedSelector: null,
    noResultsXPath: '//p[.="Nie znaleziono produktów spełniających podane kryteria."] | //p[.="Ten produkt jest niedostępny."]',
    zipcode: '',
  },
};
