
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'allegro_lovela',
    domain: 'allegro.pl',
    url: 'https://allegro.pl/uzytkownik/SmA-Lovela?string={searchTerms}',
    loadedSelector: 'div > a[name="pagination-bottom"]',
    noResultsXPath: '//div/p[contains(@class, "mp0t_ji")]',
    zipcode: '',
  },
};
