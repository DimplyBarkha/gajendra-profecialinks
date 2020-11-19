
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    domain: 'allegro.pl',
    url: 'https://allegro.pl/kategoria/moda?string={searchTerms}',
    loadedSelector: 'div.opbox-listing',
    noResultsXPath: '//p[contains(text(),"Teraz nie możemy znaleźć „")]',
    zipcode: '',
  },
};
