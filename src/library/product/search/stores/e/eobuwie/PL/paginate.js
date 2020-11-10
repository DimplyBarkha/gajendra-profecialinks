
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    nextLinkSelector: 'div.toolbar-bottom__pager a[title="Następna strona"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.products-list',
    noResultsXPath: '//p[@class="note-msg" and contains(text(),"Brak produktów odpowiadających zapytaniu")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'eobuwie.com.pl',
    zipcode: "''",
  },
};
