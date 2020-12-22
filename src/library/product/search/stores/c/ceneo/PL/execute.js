
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'ceneo',
    domain: 'ceneo.pl',
    url: 'https://www.ceneo.pl/;szukaj-{searchTerms}',
    // url: 'https://www.ceneo.pl/Odswiezacze_powietrza;szukaj-{searchTerms};0191.htm',
    // 'https://www.ceneo.pl/Mleka_modyfikowane;szukaj-{searchTerms};0191.htm',
    loadedSelector: 'div[class*=category-list-body] div[class*=js_category-list-item]',
    noResultsXPath: '//div[contains(@class,"card__body") and contains(.,"nie znaleziono")]',
    zipcode: '',
  },
};