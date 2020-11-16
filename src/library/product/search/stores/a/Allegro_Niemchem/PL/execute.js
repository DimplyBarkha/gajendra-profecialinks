
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'Allegro_Niemchem',
    domain: 'allegro.pl',
    url: 'https://allegro.pl/uzytkownik/niemchem_com?string={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
