
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    domain: 'apteka-melissa.pl',
    url: 'https://www.apteka-melissa.pl/produkt/szukaj?szukaj={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="kontener"]/div/div/h2',
    zipcode: '',
  },
};
