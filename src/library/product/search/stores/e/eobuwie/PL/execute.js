
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    domain: 'eobuwie.com.pl',
    url: 'https://www.eobuwie.com.pl/s.html?q={searchTerms}',
    loadedSelector: 'ul.products-list',
    noResultsXPath: '//p[@class="note-msg" and contains(text(),"Brak produktów odpowiadających zapytaniu")]',
    zipcode: "''",
  },
};
