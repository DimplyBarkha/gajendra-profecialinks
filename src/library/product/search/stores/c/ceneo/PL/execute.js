
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    domain: 'ceneo.pl',
    url: 'https://www.ceneo.pl/Odswiezacze_powietrza;szukaj-{searchTerms};0191.htm',
    // 'https://www.ceneo.pl/Mleka_modyfikowane;szukaj-{searchTerms};0191.htm',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
